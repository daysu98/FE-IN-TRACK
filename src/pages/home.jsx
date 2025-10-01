import React from "react";
import { Link } from "react-router";
import Logo from "../assets/img/logo.png";
import SponsorLogos from "../assets/img/sponsor.png";
import FeatureImage from "../assets/img/homeitd.png";
import BackgroundImage from "../assets/img/background.png";

export const Home = () => {
  return (
    <div className="bg-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <nav className="container mx-auto bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md flex justify-end items-center">
          <Link
            to="/register"
            className="font-semibold px-6 py-2 rounded-lg text-black hover:text-gray-700 transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main>
        <section className="bg-[#4FD1C5] pt-40 pb-32 text-center text-white relative overflow-hidden rounded-b-[4%] h-[80vh] flex items-center">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
          ></div>
          <div className="container mx-auto px-4 relative">
            <div className="flex justify-center items-center gap-4 mb-8">
                <img
                  src={Logo}
                  alt="InTrack Logo"
                  className="h-25 w-20"
                />
                <h1 className="text-6xl md:text-7xl font-bold">In Track</h1>
            </div>
            <p className="max-w-3xl mx-auto text-3xl mb-12">
              a task management platform that keeps you organized, focused, and
              always on schedule with real-time tracking and smart reminders.
            </p>
          </div>
        </section>

        <section className="relative -mt-16 z-10 py-2">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl ">
                    <h2 className="text-gray-600 mb-10 font-medium pt-5 text-center text-2xl">
                        Trusted by customers from all over the world
                    </h2>
                    <img
                      src={SponsorLogos}
                      alt="Sponsors"
                      className="mx-auto h-auto w-full max-w-4xl"
                    />
                </div>
            </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 space-y-24">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <img
                  src={FeatureImage}
                  alt="Managing Internships"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-bold text-gray-800 mb-6">
                  Managing Internships Made Easier
                </h3>
                <p className="text-gray-800 font-medium text-2xl leading-relaxed">
                  With InTrack, all internship <br /> processes from start to finish
                  can be <br /> monitored and managed in one <br /> integrated platform.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-center md:text-left md:order-1 order-2">
                <h3 className="text-4xl font-bold text-gray-800 mb-6">
                  Smoother Collaboration
                </h3>
                <p className="text-gray-800 font-medium text-2xl leading-relaxed">
                  Communication between <br /> participants, mentors, and admins <br />
                  becomes more efficient with intuitive <br /> collaboration and
                  dashboard <br /> features.
                </p>
              </div>
              <div className="md:order-2 order-1">
                <img
                  src={FeatureImage}
                  alt="Smoother Collaboration"
                  className="rounded-lg shadow-xl w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#A1EBE4] py-24">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-bold mb-4 text-gray-800">Get Started Today</h3>
            <p className="max-w-4xl mx-auto text-xl mb-12 text-gray-800 leading-relaxed">
              InTrack helps interns complete tasks on time and increase their
              daily productivity. 
            </p>
            <Link
                to="/register"
                className="bg-white text-[#4FD1C5] font-bold px-12 py-4 rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                GET STARTED
            </Link>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <img
                  src={FeatureImage}
                  alt="Real Time Monitoring"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-bold text-gray-800 mb-6">
                  Real Time Monitoring
                </h3>
                <p className="text-gray-800 font-medium text-2xl leading-relaxed">
                  Monitor intern progress in real time. <br /> Get notified whenever
                  there is an <br /> update on assignments, reports, or <br /> issues.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p className="text-lg">&copy; 2025 InTrack. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
};