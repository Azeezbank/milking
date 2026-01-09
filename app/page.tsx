"use client";
import { Check, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LoadingModal } from "./components/modal/page";
import Footer from "./components/footer/footer";
import backendUrl from "../app/config";


export default function Home() {
  const router = useRouter();

  const [isAuthFotm, setIsAuthForm] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/v1/auth/register`, { name, email, phone, username, password, confirmPassword }, { withCredentials: true });
      if (response.status === 201) {
        setLoading(false);
        setIsAuthForm(true);
      }
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      alert(err.response.data.message || 'Registration Failed');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/v1/auth/login`, { identifier, password }, { withCredentials: true });
      // if (response.status === 200) {
      router.push('/dashboard');
      setLoading(false);
      // }
    } catch (err: any) {
      console.error(err);
      // safer alert
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <header className="bg-sky-500 fixed w-full z-5 py-2">
        <nav className="flex gap-2 items-center px-10">
          <div className="bg-gray-50 m-2 rounded-full">
            <img src={'https://www.sparkgist.com/wp-content/uploads/2022/05/CWAY-Group.jpeg'} alt="Logo" className="w-13 rounded-lg" />
          </div>
          <h1 className="font-mono font-bold text-white text-4xl">MilkingTeam</h1>
        </nav>
      </header>
      <main className="bg-sky-500 px-10 pb-5 pt-25 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl tracking-wide">Great Milking Starts <br /> <span></span>With a Great Team</h1>
          <p className="text-white pt-2">A smart system to track milking attendance,
            milk yield, overtime, and daily records helping your
            milking team work faster, cleaner, and more accurately.</p>

          <h3 className="text-white text-2xl pt-7 pb-2">APP FEATURES</h3>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Attendance Module</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Overtime Management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Milk Record Management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Reports & Analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Off schedule</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white w-4 h-4 rounded-full flex items-center"><Check size={15} className="text-sky-500" /></div>
            <p className="text-white">Notifications</p>
          </div>

          <p className="border border-white px-3 py-1 rounded-lg text-white w-fit mt-5 cursor-pointer">See All Features</p>
          <div className="relative pt-25 pb-45">
            <div className={` ${isAuthFotm ? 'pt-2' : 'pt-20'}`}>
              <h2 className="text-sky-500 bg-white w-fit px-5 py-2 rounded-xl text-center">
                Free <br /> for <br /> <span className="font-bold text-xl">All</span> <br />The <br />Members
              </h2>
            </div>
            <div className={`bg-white rounded-xl absolute top-10 right-0 left-23 py-8 shadow-2xl ${isAuthFotm ? 'hidden' : 'block'}`}>
              <form className={`relative z-2 px-4 py-2`} onSubmit={handleRegister}>
                <h2 className="font-bold text-lg text-center pb-3">SIGN UP FORM</h2>
                <input type="text" value={name} placeholder="Full Name" className="outline-none border-b border-b-gray-300 pb-2 w-full" onChange={(e: any) => setName(e.target.value)} required /> <br />
                <input type="text" value={email} placeholder="Email" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: any) => setEmail(e.target.value)} required /> <br />
                <input type="tel" value={phone} placeholder="Mobile Number" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: any) => setPhone(e.target.value)} required /> <br />
                <input type="text" value={username} placeholder="Username" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: any) => setUsername(e.target.value)} required /> <br />
                <input type="password" value={password} placeholder="Password" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: any) => setPassword(e.target.value)} required /> <br />
                <input type="password" value={confirmPassword} placeholder="Confirm password" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} required /> <br />
                <p className={`text-sm text-red-700 pb-2 ${confirmPassword !== password ? 'block' : 'hidden'}`}>Password Mismatch, Please Check</p>
                <button type="submit" className="bg-sky-500 mb-3 mt-4 py-2 rounded-full text-center w-full flex gap-2 items-center justify-center cursor-pointer">
                  <span className="text-gray-300">Register</span>
                  <span><ArrowBigRight size={15} className="fill-current text-white" /></span>
                </button>
                <p className="text-right ">Have an account? <span className="text-sky-500 underline cursor-pointer" onClick={() => setIsAuthForm(true)}>Sign in</span></p>
              </form>
            </div>
            <div className={`bg-white rounded-xl absolute top-10 right-0 left-23 pt-8 shadow-2xl ${isAuthFotm ? 'opacity-100' : 'opacity-0'}`}>
              <form className={`px-4 py-4`} onSubmit={handleLogin}>
                <h2 className="font-bold text-lg text-center pb-5">SIGN IN FORM</h2>
                <input type="text" value={identifier} placeholder="Username / Email" className="outline-none border-b border-b-gray-300 pb-2 w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)} required /> <br />
                <input type="password" value={password} placeholder="Password" className="outline-none border-b border-b-gray-300 py-2 w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required /> <br />
                <button type="submit" className="bg-sky-500 mt-8 py-2 rounded-full text-center w-full flex gap-2 items-center justify-center cursor-pointer">
                  <span className="text-gray-300">Login</span>
                  <span><ArrowBigRight size={15} className="fill-current text-white" /></span>
                </button>
                <p className="text-black text-right pt-5" onClick={() => setIsAuthForm(false)}>New Here? <span className="text-sky-500 underline cursor-pointer">Register</span></p>
              </form>
            </div>
          </div>
        </div>
      </main>
      {/* <div className={`${loading? 'hidden' : 'block z-50 bg-red-600'}`}> */}
      <LoadingModal isOpen={loading} />
      {/* </div> */}

      {/* ===== ABOUT / WHO WE ARE ===== */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758"
            className="rounded-3xl shadow-xl"
            alt="Dairy team at work"
          />
          <div>
            <h2 className="text-4xl font-bold text-sky-600 mb-4">🐄 Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              We are a dedicated milking team committed to producing clean, safe, and high-quality milk through discipline, teamwork, and proper milking practices.
              Our team works daily to ensure every cow is milked on time, correctly, and hygienically.
            </p>
          </div>
        </div>
      </section>

      {/* ===== VISION & MISSION ===== */}
      <section className="bg-sky-50 py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-bold text-sky-600 mb-3">🌍 Our Vision</h3>
            <p className="text-gray-700">
              To set the standard for professional milking teams by promoting hygiene, accountability,
              teamwork, and consistency in dairy farming.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-bold text-sky-600 mb-3">🎯 Our Mission</h3>
            <p className="text-gray-700">
              To milk every cow with care, accuracy, and responsibility while maintaining high milk
              quality and supporting farm productivity.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM WE SOLVE ===== */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-sky-600 mb-8">⚠️ The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "❌ Irregular milking schedules and absenteeism",
              "❌ Poor hygiene leading to milk contamination",
              "❌ Inaccurate milk yield and overtime records",
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl shadow-md bg-sky-50">
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO WE SERVE ===== */}
      <section className="bg-sky-500 py-20 px-6 md:px-20 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">👥 Who We Serve</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Dairy Farm Owners", "Farm Managers", "Milk Processing Units", "Consumers"].map(
              (item, i) => (
                <div key={i} className="bg-white text-sky-600 py-6 rounded-2xl font-semibold shadow-lg">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-sky-600 mb-8">✨ The Change We Create</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Because we exist, farms experience cleaner milk, improved trust between workers and management,
            better cow welfare, reduced losses, and a more motivated milking workforce.
          </p>
        </div>
      </section>

      {/* ================= STRUCTURE & WORKFLOW ================= */}
      <section className="bg-sky-50 py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-sky-600 text-center mb-10">
            🧩 Our Structure & Way of Working
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Prepare cows & equipment 🧼",
              "Milk with care & accuracy 🥛",
              "Record yield & attendance 📝",
              "Clean up & report issues 🔍",
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg text-center"
              >
                <p className="font-semibold text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-sky-600 mb-10">🤝 Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {["Lead Milking Supervisor", "Hygiene & Quality Officer", "Milk Records Coordinator"].map(
              (role, i) => (
                <div key={i} className="shadow-lg rounded-3xl p-6">
                  <img
                    src="https://i.pravatar.cc/300"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <p className="font-bold text-lg">{role}</p>
                  <p className="text-gray-600 text-sm">
                    Ensuring quality, discipline, and teamwork every milking session.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>


      {/* ================= MEET OUR TEAM ================= */}
      <section className="bg-sky-50 py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sky-600 mb-3">
              🤝 Meet Our Milking Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A well-structured, disciplined team working together to ensure clean
              milk, healthy cows, and smooth daily milking operations.
            </p>
          </div>

          {/* Leadership Row */}
          <div className="grid md:grid-cols-2 gap-10 mb-20">
            {/* Team Leader */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-5 py-1 rounded-full text-sm font-semibold shadow-md">
                Team Leader 🏆
              </span>
              <img
                src="https://i.pravatar.cc/300"
                alt="Usman"
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-sky-200"
              />
              <h3 className="text-xl font-bold text-gray-800">Usman</h3>
              <p className="text-sky-600 font-medium">Team Leader</p>
              <p className="text-gray-600 text-sm mt-3">
                Leads and coordinates all milking activities, enforces hygiene
                standards, and ensures smooth collaboration across the team.
              </p>
            </div>

            {/* Deputy Leaders */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-sky-600 mb-6 text-center">
                Deputy Team Leaders ⭐
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { name: "Hassan", role: "Deputy Team Leader I" },
                  { name: "Wumi", role: "Deputy Team Leader" },
                  { name: "Susan", role: "Deputy Team Leader" },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="text-center p-5 rounded-2xl bg-sky-50 hover:bg-sky-100 transition"
                  >
                    <img
                      src="https://i.pravatar.cc/300"
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-sky-200"
                      alt={member.name}
                    />
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sky-600 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operations Team */}
          <div>
            <h3 className="text-2xl font-bold text-sky-600 text-center mb-10">
              🧑🏽‍🌾 Operations Officers
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                "Banky",
                "Jimi",
                "Idris",
                "Logbon",
              ].map((name, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group"
                >
                  <img
                    src="https://i.pravatar.cc/300"
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-sky-100 group-hover:ring-sky-400"
                    alt={name}
                  />
                  <h4 className="font-semibold text-gray-800">{name}</h4>
                  <p className="text-sky-600 text-sm">Operations Officer</p>
                  <p className="text-gray-500 text-xs mt-3">
                    Responsible for daily milking tasks, cow handling, and cleanliness.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ================= CONTACT US ================= */}
      <section className="bg-linear-to-br from-sky-600 to-sky-500 py-24 px-6 md:px-20 text-white relative overflow-hidden">
        {/* Decorative icons */}
        <div className="absolute top-10 left-10 text-white/20 text-6xl">🥛</div>
        <div className="absolute bottom-10 right-10 text-white/20 text-6xl">🐄</div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">📞 Contact Our Milking Team</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Whether you want to work with us, partner with our team, or make
              enquiries about our milking operations, we’re always happy to hear from
              you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <a
              href="mailto:milkingteam@gmail.com"
              className="bg-white text-sky-600 rounded-3xl p-8 shadow-xl hover:scale-105 transition-transform duration-300 text-center"
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-bold text-xl mb-2">Email Us</h3>
              <p className="text-sm">milkingteam@gmail.com</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              className="bg-white text-green-600 rounded-3xl p-8 shadow-xl hover:scale-105 transition-transform duration-300 text-center"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-xl mb-2">WhatsApp</h3>
              <p className="text-sm">Chat with our team instantly</p>
            </a>

            {/* Phone */}
            <a
              href="tel:+2348012345678"
              className="bg-white text-sky-600 rounded-3xl p-8 shadow-xl hover:scale-105 transition-transform duration-300 text-center"
            >
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-xl mb-2">Call Us</h3>
              <p className="text-sm">+234 801 234 5678</p>
            </a>
          </div>

          {/* Social Handles */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold mb-6">🌐 Connect With Us</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="#"
                className="bg-white text-sky-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-sky-100 transition"
              >
                📘 Facebook
              </a>
              <a
                href="#"
                className="bg-white text-sky-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-sky-100 transition"
              >
                📸 Instagram
              </a>
              <a
                href="#"
                className="bg-white text-sky-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-sky-100 transition"
              >
                🐦 Twitter / X
              </a>
              <a
                href="#"
                className="bg-white text-sky-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-sky-100 transition"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
