export const HomePage = () => (
  <section className="home-page" aria-label="Home">
    <h1 className="sr-only">Home</h1>
    <video
      className="home-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source
        src="/videos/20260102_1547_New%20Video_storyboard_01kdzjv6qpff7b0a7wh52wmgv7.mp4"
        type="video/mp4"
      />
    </video>
  </section>
);
