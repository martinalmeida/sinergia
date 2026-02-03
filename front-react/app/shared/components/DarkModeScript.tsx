export function DarkModeScript() {
  const darkModeScript = `
    (function() {
      try {
        const stored = window.localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored === null ? prefersDark : stored === 'true';
        
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      } catch (e) {
        console.error('Error inicializando dark mode:', e);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: darkModeScript }}
      suppressHydrationWarning
    />
  );
}