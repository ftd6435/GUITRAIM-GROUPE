export const applySeo = ({ title, description, fallbackTitle }) => {
  if (typeof document === 'undefined') return;

  const nextTitle = title || fallbackTitle;
  if (nextTitle) document.title = nextTitle;

  if (description !== undefined) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description || '');
  }
};

