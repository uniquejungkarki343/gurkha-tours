import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
function Shell({ title, children, foot }) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl bg-white p-7 shadow">
      <h1 className="font-display text-3xl text-ink">{title}</h1>{children}<p className="mt-5 text-center text-sm text-slate-500">{foot}</p>
    </div>
  );
}
function useAuthForm(validate, action) {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [errs, setErrs] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const from = useLocation().state?.from || "/";
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(f); setErrs(e); setServerErr("");
    if (Object.keys(e).length) return;
    try { action(f); nav(from, { replace: true }); } catch (err) { setServerErr(err.message); }
  };
  const input = (k, label, type = "text") => (
    <label className="mt-4 block text-sm font-medium">{label}
      <div className="relative">
        <input className={`input mt-1 ${errs[k] ? "border-red-400" : ""}`} type={k === "password" && show ? "text" : type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
        {k === "password" && <button type="button" className="absolute right-3 top-3.5 text-xs text-slate-500" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>}
      </div>
      {errs[k] && <span className="text-xs text-red-600">{errs[k]}</span>}
    </label>
  );
  return { submit, input, serverErr };
}
const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);
export function Login() {
  const { login } = useAuth();
  const loc = useLocation();
  const { submit, input, serverErr } = useAuthForm(
    (f) => ({ ...(!emailOk(f.email) && { email: "Enter a valid email." }), ...(!f.password && { password: "Password is required." }) }),
    (f) => login(f.email, f.password)
  );
  return (
    <Shell title="Welcome back" foot={<>New here? <Link to="/register" state={loc.state} className="text-brand underline">Create an account</Link></>}>
      <form onSubmit={submit} noValidate>{input("email", "Email", "email")}{input("password", "Password", "password")}
        {serverErr && <p className="mt-3 text-sm text-red-600">{serverErr}</p>}<button className="btn mt-5 w-full">Login</button></form>
    </Shell>
  );
}
export function Register() {
  const { register } = useAuth();
  const loc = useLocation();
  const { submit, input, serverErr } = useAuthForm(
    (f) => ({
      ...(f.name.trim().length < 2 && { name: "Enter your name." }),
      ...(!emailOk(f.email) && { email: "Enter a valid email." }),
      ...(f.password.length < 6 && { password: "Use at least 6 characters." }),
    }),
    (f) => register(f.name.trim(), f.email, f.password)
  );
  return (
    <Shell title="Create account" foot={<>Already registered? <Link to="/login" state={loc.state} className="text-brand underline">Login</Link></>}>
      <form onSubmit={submit} noValidate>{input("name", "Full name")}{input("email", "Email", "email")}{input("password", "Password", "password")}
        {serverErr && <p className="mt-3 text-sm text-red-600">{serverErr}</p>}<button className="btn mt-5 w-full">Sign up</button></form>
    </Shell>
  );
}
