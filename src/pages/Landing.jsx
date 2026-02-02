import { useNavigate } from "react-router-dom";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-linear-to-b from-white via-blue-50/30 to-white text-gray-800">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 backdrop-blur-md bg-white/70 border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold text-blue-500 tracking-tight cursor-pointer">
            exPtrack
          </h1>

          <div className="flex gap-5 items-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="text-center pt-24 pb-28 px-6 max-w-4xl mx-auto relative">

        {/* glow */}
        <div className="absolute -z-10 top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />

        <h2 className="text-5xl font-bold leading-tight tracking-tight mb-5">
          Track expenses.
          <br />
          <span className="text-blue-600">Build wealth with clarity.</span>
        </h2>

        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          A simple personal finance dashboard to manage income, expenses,
          savings and debt - all in one place.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:bg-blue-700 transition"
        >
          Get Started Free
        </button>
      </section>


      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="flex justify-center px-6 mb-24">
        <img
          src="/exPtrack_Mockup.png"
          alt="dashboard"
          className="rounded-3xl shadow-2xl max-w-5xl w-full hover:scale-[1.01] transition"
        />
      </section>


      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold text-center mb-12">
          Everything you need to manage money
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            icon={<BarChart3 size={24} />}
            title="Smart Dashboard"
            desc="Income, expenses, savings & debt in one clear view."
          />

          <Feature
            icon={<ShieldCheck size={24} />}
            title="Secure by Design"
            desc="JWT authentication and protected APIs keep your data safe."
          />

          <Feature
            icon={<Zap size={24} />}
            title="Lightning Fast"
            desc="Add transactions instantly with zero friction."
          />
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-3xl text-center py-14 shadow-2xl">
          <h3 className="text-2xl font-semibold mb-6">
            Ready to take control of your money?
          </h3>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:scale-105 transition"
          >
            Start for Free
          </button>
        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="text-center text-sm text-gray-400 py-8">
        © {new Date().getFullYear()} exPtrack • Built with ❤️
      </footer>
    </div>
  );
}


function Feature({ icon, title, desc }) {
  return (
    <div className="
      p-8
      rounded-2xl
      bg-white
      border
      border-gray-100
      shadow-sm
      hover:shadow-lg
      transition
    ">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
