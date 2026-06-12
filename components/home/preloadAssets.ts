const imageAssets = [
  "/assets/images/ay-logo-large-clear.png",
  "/assets/images/Particle-Engine.png",
  "/assets/images/CraveAI.png",
  "/assets/images/anime-score-predictor.png",
  "/assets/images/Portfolio.png",
  "/assets/images/XY-Ball-Fight.png",
  "/assets/images/Chess.png",
  "/assets/images/Evodle.png",
  "/assets/images/NLP.png",
  "/assets/images/Vankl.png",
  "/assets/images/ACME-Run.png",
  "/assets/images/Island.png",
  "/assets/images/Mesh.png",
  "/assets/images/piraten karpen.png",
  "/assets/images/me_with_cat.jpg",
  "/assets/icons/about.png",
  "/assets/icons/links.png",
  "/assets/icons/work.png",
  "/assets/icons/projects.png",
  "/assets/icons/faq.png",
  "/assets/icons/contacts.png",
  "/assets/icons/volume_on.png",
  "/assets/icons/volume_off.png",
  "/assets/icons/github-logo.png",
  "/assets/icons/linkedin-logo.png",
  "/assets/icons/gmail-logo.png",
  "/assets/icons/youtube-logo.png",
  "/assets/icons/instagram-logo.png",
  "/assets/icons/twitch-logo.png",
  "/assets/icons/spotify-logo.png",
  "/assets/icons/Amazon.png",
  "/assets/icons/CIBC.png",
] as const;

const audioAssets = [
  "/assets/sounds/click.mp3",
  "/assets/sounds/close_window.mp3",
  "/assets/sounds/faq_slide_down_up.mp3",
  "/assets/sounds/light_mode_toggle.mp3",
  "/assets/sounds/night_mode_toggle.mp3",
  "/assets/sounds/sound_toggle.mp3",
] as const;

let didStartPreloading = false;

export function preloadHomeAssets() {
  if (didStartPreloading || typeof window === "undefined") return;
  didStartPreloading = true;

  preloadImages();
  preloadAudio();
}

function preloadImages() {
  imageAssets.forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    image.decode?.().catch(() => {
      // If a browser cannot decode early, the fetch still warms the cache.
    });
  });
}

function preloadAudio() {
  audioAssets.forEach((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.load();
  });
}
