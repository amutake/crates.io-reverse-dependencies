function addLink(crate) {
  document.addEventListener('DOMNodeInserted', function (ev) {
    if (ev.path[0].id === 'crate-links') {
      const links = document.querySelector('#crate-links>.section>ul');
      if (links) {
        const a = document.createElement('a');
        a.href = `/crates/${crate}/reverse_dependencies`;
        a.innerHTML = 'Reverse Dependencies';

        const link = document.createElement('li');
        link.appendChild(a);

        links.appendChild(link);
      }
    }
  });
}

const r = /\/crates\/([a-zA-Z0-9-_]+)/;
const matches = window.location.pathname.match(r);
if (matches) {
  const crate = matches[1];
  addLink(crate);
}
