// fetchRevDeps: String -> Promise { list: Array { name: String, version: String }, total: Number }
function fetchRevDeps(crate) {
  return fetch(`/api/v1/crates/${crate}/reverse_dependencies`)
    .then((res) => res.json())
    .then((json) => ({
      list: json.dependencies.map((rd) => ({
        name: rd.crate_id,
        version: rd.req
      })),
      total: json.meta.total
    }));
}

function buildSection(revDeps) {
  const section = document.createElement('div');
  section.className = 'section';
  section.id = 'crate-reverse-dependencies';

  const h3 = document.createElement('h3');
  h3.innerText = 'Reverse-Dependencies';
  section.appendChild(h3);

  const list = document.createElement('ul');
  if (revDeps.total === 0) {
    const item = document.createElement('li');
    item.innerText = 'None';
    list.appendChild(item);
  } else {
    revDeps.list.forEach((rd) => {
      const link = document.createElement('a');
      link.href = `/crates/${rd.name}`;
      link.innerText = `${rd.name} ${rd.version}`;
      const item = document.createElement('li');
      item.appendChild(link);
      list.appendChild(item);
    });
  }
  section.appendChild(list);

  if (revDeps.list.length < revDeps.total) {
    const span = document.createElement('span');
    span.className = 'small';
    const link = document.createElement('a');
    link.href = `/crates/${crate}/reverse_dependencies`;
    link.innerText = `show all ${revDeps.total} reverse-dependencies`;
    span.appendChild(link);
    section.appendChild(span);
  };

  return section;
}

function addLink(crate) {
  const revDepsPromise = fetchRevDeps(crate);
  document.addEventListener('DOMNodeInserted', (ev) => {
    if (ev.target.id === 'crate-links') {
      const links = document.querySelector('#crate-links');
      if (links) {
        revDepsPromise
          .then(buildSection)
          .then((section) => {
            links.appendChild(section);
          });
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
