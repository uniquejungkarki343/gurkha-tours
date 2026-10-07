export const Loading = () => <div className="py-20 text-center text-slate-500" role="status"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-brand" />Loading…</div>;
export const ErrorBox = ({ message, retry }) => (
  <div className="mx-auto my-10 max-w-md rounded-xl bg-red-50 p-5 text-center text-red-700">
    <p>{message}</p>{retry && <button className="btn mt-3" onClick={retry}>Try again</button>}
  </div>
);
