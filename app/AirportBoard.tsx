"use client";

import { useEffect, useState } from "react";

type Project = {
  title: string;
  medium: string;
  status: string;
  videoId: string | null;
};

const projects: Project[] = [
  {
    title: "SATURN - a Sci-Fi series",
    medium: "MOVING IMAGE",
    status: "NOW SHOWING",
    videoId: "3qmLsiSIkbA",
  },
  {
    title: "Trojan",
    medium: "INTERACTIVE",
    status: "SCHEDULED",
    videoId: "DmnHOzuKL7A",
  },
  {
    title: "YUI MOTION LAB",
    medium: "MOTION CAPTURE",
    status: "BOARDING",
    videoId: "omSxURLrWiI",
  },


];

function getLondonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function AirportBoard() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [londonTime, setLondonTime] = useState("--:--");

  const selectedProject = projects[selectedIndex];

  useEffect(() => {
    function updateClock() {
      setLondonTime(getLondonTime());
    }

    updateClock();

    const interval = window.setInterval(updateClock, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const videoUrl = selectedProject.videoId
    ? `https://www.youtube.com/embed/${selectedProject.videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${selectedProject.videoId}&controls=0&rel=0`
    : null;

  return (
    <section className="airport-studio" aria-label="Selected moving image">
      <div className="airport-stage">
        <div
          className="airport-hanger airport-hanger-left"
          aria-hidden="true"
        />

        <div
          className="airport-hanger airport-hanger-right"
          aria-hidden="true"
        />

        <div className="airport-board">
          <div className="airport-inner">
            <header className="airport-header">
              <span className="airport-heading">DEPARTURES</span>

              <div className="airport-clock">
                <span>LONDON</span>

                <time>{londonTime}</time>

                <span className="airport-status-light" aria-hidden="true" />
              </div>
            </header>

            <div className="airport-video">
              {videoUrl ? (
                <iframe
                  key={selectedProject.videoId}
                  src={videoUrl}
                  title={`${selectedProject.title} — Yufei Jiao`}
                  loading="eager"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="airport-placeholder">
                  <span>NEOPLANT</span>

                  <small>VISUAL PREVIEW COMING SOON</small>
                </div>
              )}

              <div className="airport-scanlines" aria-hidden="true" />

              <div className="airport-vignette" aria-hidden="true" />
            </div>

            <div className="airport-projects">
              <div className="airport-row airport-row-heading">
                <span>PROJECT</span>
                <span>MEDIUM</span>
                <span>STATUS</span>
              </div>

              {projects.map((project, index) => {
                const isActive = selectedIndex === index;

                return (
                  <button
                    key={project.title}
                    type="button"
                    className={`airport-row airport-project ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={isActive}
                  >
                    <span>{project.title}</span>

                    <span>{project.medium}</span>

                    <span className="airport-project-status">
                      {project.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <span
            className="airport-screw airport-screw-top-left"
            aria-hidden="true"
          />

          <span
            className="airport-screw airport-screw-top-right"
            aria-hidden="true"
          />

          <span
            className="airport-screw airport-screw-bottom-left"
            aria-hidden="true"
          />

          <span
            className="airport-screw airport-screw-bottom-right"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}