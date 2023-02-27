const sendMessage = async (
  chatId: string,
  message: string,
  options?: string
) => {
  if (document.getElementById(chatId) == null) {
    var script = document.createElement('script');
    script.id = chatId;
    const textContent = `
      sendMessage(
        "${chatId}",
        "${message}".split("{nl}").join("\\n"),
        ${JSON.stringify(options).replace('"', '\n"')}
      ).then((a) => {
        setTimeout(() => archiveChat("${chatId}"), 3000);
      })
    `;
    script.textContent = textContent;
    document.head.appendChild(script);
  }
};

const clearContacts = async () => {
  console.log('Entra');
  const can = await (
    await fetch('https://newmkt.glutoes.com/get_null_contacts/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();

  if (can.length) {
    console.log('Limpa a base');
    var script = document.createElement('script');
    const random = Math.random();
    script.id = random + 'runner';
    script.textContent = `
      const runChecker${String(random).replace('.', '_')} = async () => {
        console.log("Tenta Limpar")
        const contacts = JSON.stringify(await window.clearContacts(${JSON.stringify(
          can
        )}));
        var script = document.createElement("script");
        script.id = "${String(random).replace('.', '_')}";
        script.textContent = contacts
        document.head.appendChild(script);

      }
      runChecker${String(random).replace('.', '_')}()
    `;
    document.head.appendChild(script);

    let contacts = document.getElementById(String(random).replace('.', '_'));

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    while (contacts == null) {
      await sleep(10000);
      contacts = document.getElementById(String(random).replace('.', '_'));
    }

    contacts = JSON.parse((contacts as HTMLElement).innerText);

    if ((contacts as any).length) {
      fetch('https://newmkt.glutoes.com/contacts-validator/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: contacts,
        }),
      });
    } else {
      return false;
    }
  }
  return can.length ? true : false;
};

const getMe = async () => {
  let me = document.querySelector('#Me');

  if (me) {
    return me.innerHTML;
  }

  var meScript = document.createElement('script');
  meScript.id = 'MyNumber';
  meScript.textContent = `
  var me = window.Store.User.getMeUser().user
  var script = document.createElement("script");
  script.id = "Me";
  script.textContent = me
  document.head.appendChild(script);
  `;

  document.head.appendChild(meScript);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  let trier = 0;
  while (me == null && trier < 3) {
    await sleep(5000);
    me = document.querySelector('#Me');
    trier++;
  }
  if (trier >= 3) {
    return '';
  }
  return me ? me.innerHTML : null;
};

const segment = async (restaurantId: string, window: any) => {
  const me = await getMe();
  const can = await (
    await fetch(
      'https://newmkt.glutoes.com/can_segment_whatsapp/' +
        restaurantId +
        '?whatsapp=' +
        me,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
  ).json();

  if (can) {
    window.webContents.send('CAN_SEGMENT', true);
  }
};

export { sendMessage, segment, clearContacts, getMe };
