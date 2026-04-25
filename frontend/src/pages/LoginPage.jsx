import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { session, signIn } = useAuth();
  const [form, setForm] = useState({
    email: "admin@rescue.local",
    password: "password123"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signIn(form);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_25%),linear-gradient(160deg,_#08111f,_#030712)] px-4 py-8 font-body sm:px-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur sm:rounded-[32px] sm:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <ShieldCheck size={28} />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-cyan-300/80">
            Sentinel Access Console
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Bluewatch Nexus
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300 sm:mt-6 sm:text-lg">
            Secure sign-in for the live signal workspace handling movement events, route visibility, and operator response tracking.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5 shadow-glow backdrop-blur sm:rounded-[32px] sm:p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Secure Sign-In</p>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">Operator access</h2>
          <div className="mt-6 space-y-4 sm:mt-8">
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              placeholder="admin@rescue.local"
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              placeholder="Enter secure password"
            />
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Enter Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
