const Footer = () => {
  return (
    <footer className="glass border-x-0 border-b-0 py-4 mt-auto">
      <div className="container flex flex-col sm:flex-row justify-between items-center gap-3 mx-auto">
        <p className="font-mono text-sm text-slate-400">
          <span className="text-slate-500">~$</span> built with{" "}
          <a
            href="http://reactjs.org"
            target="_blank"
            rel="noreferrer"
            className="text-term-cyan hover:underline"
          >
            React
          </a>{" "}
          <span className="text-slate-500">&&</span>{" "}
          <a
            href="http://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="text-term-cyan hover:underline"
          >
            Vercel
          </a>
        </p>
        <p className="text-sm">
          <a
            href="https://github.com/iskandar45"
            target="_blank"
            rel="noreferrer"
            aria-label="Author's GitHub profile"
            className="text-slate-400 hover:text-term-green transition-colors"
          >
            <svg height="28" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="28">
              <path
                fill="currentColor"
                d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
              ></path>
            </svg>
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
