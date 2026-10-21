// SaveFrom.net Web Application Core Script
document.addEventListener("DOMContentLoaded", () => {
  const sfForm = document.getElementById("sf_form");
  const sfUrlInput = document.getElementById("sf_url");
  const sfSubmitBtn = document.getElementById("sf_submit");
  const btnClear = document.getElementById("btn_clear");
  const btnPaste = document.getElementById("btn_paste");

  const resultSection = document.getElementById("result_section");
  const loadingBox = document.getElementById("loading_box");
  const errorBox = document.getElementById("error_box");
  const mediaResultCard = document.getElementById("media_result_card");

  // Result card elements
  const mediaThumbImg = document.getElementById("media_thumb_img");
  const mediaDuration = document.getElementById("media_duration");
  const mediaPlatform = document.getElementById("media_platform");
  const mediaTitle = document.getElementById("media_title");
  const qualitySelect = document.getElementById("quality_select");
  const btnCardDownload = document.getElementById("btn_card_download");

  // Keep state
  let currentVideoData = null;

  // 1. Clear button
  if (btnClear) {
    btnClear.addEventListener("click", (e) => {
      e.preventDefault();
      sfUrlInput.value = "";
      sfUrlInput.focus();
      hideResults();
    });
  }

  // 2. Paste button
  if (btnPaste) {
    btnPaste.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          sfUrlInput.value = text.trim();
          handleUrlSubmit();
        }
      } catch (err) {
        console.warn("Clipboard access denied or unsupported:", err);
        sfUrlInput.focus();
      }
    });
  }

  // 3. Form Submission
  if (sfForm) {
    sfForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUrlSubmit();
    });
  }

  // 4. Platform pills click to test or focus
  const sampleLinks = {
    YouTube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    TikTok: "https://www.tiktok.com/@tiktok/video/7106594312292453678",
    Instagram: "https://www.instagram.com/reel/C8qL9XlR1iB/",
    Facebook: "https://www.facebook.com/watch/?v=10153231379946729",
    Twitter: "https://twitter.com/Twitter/status/1580983151433355264",
    Vimeo: "https://vimeo.com/76979871",
    Reddit: "https://www.reddit.com/r/NatureIsFuckingLit/comments/sample_video/"
  };

  document.querySelectorAll(".platform-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const platform = pill.dataset.platform;
      if (sampleLinks[platform]) {
        sfUrlInput.value = sampleLinks[platform];
        handleUrlSubmit();
      } else {
        sfUrlInput.placeholder = `Paste ${platform} video link here...`;
        sfUrlInput.focus();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // 5. Handle Extract Video Request
  async function handleUrlSubmit() {
    const url = sfUrlInput.value.trim();
    if (!url) {
      showError("Please paste a valid video URL first.");
      sfUrlInput.focus();
      return;
    }

    // Reset UI state
    showLoading();

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to extract video information.");
      }

      currentVideoData = data;
      renderResultCard(data);
    } catch (err) {
      showError(err.message || "An unexpected error occurred while processing the video.");
    }
  }

  // 6. Render Result Card
  function renderResultCard(data) {
    loadingBox.style.display = "none";
    errorBox.style.display = "none";
    mediaResultCard.style.display = "flex";
    resultSection.style.display = "block";

    // Set Thumbnail
    mediaThumbImg.src = data.thumbnail || "/static/img/video.svg";
    mediaThumbImg.alt = data.title;

    // Duration
    if (data.duration) {
      mediaDuration.textContent = data.duration;
      mediaDuration.style.display = "inline-block";
    } else {
      mediaDuration.style.display = "none";
    }

    // Platform tag
    mediaPlatform.textContent = data.platform || "Video";

    // Title
    mediaTitle.textContent = data.title || "Untitled Video";

    // Populate format options in dropdown
    qualitySelect.innerHTML = "";
    if (data.options && data.options.length > 0) {
      data.options.forEach((opt, idx) => {
        const optionEl = document.createElement("option");
        optionEl.value = idx;
        const sizeInfo = opt.size ? ` (${opt.size})` : "";
        optionEl.textContent = `${opt.quality}${sizeInfo}`;
        qualitySelect.appendChild(optionEl);
      });
    } else {
      const defaultOption = document.createElement("option");
      defaultOption.value = 0;
      defaultOption.textContent = "MP4 Standard Quality";
      qualitySelect.appendChild(defaultOption);
    }

    // Scroll smoothly to results
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // 7. Download Button Trigger
  if (btnCardDownload) {
    btnCardDownload.addEventListener("click", () => {
      if (!currentVideoData) return;

      const selectedIdx = qualitySelect.value || 0;
      const selectedOption = currentVideoData.options ? currentVideoData.options[selectedIdx] : null;

      const formatId = selectedOption ? selectedOption.format_id : "best";
      const isAudio = selectedOption ? selectedOption.is_audio : false;
      const title = currentVideoData.title || "video";

      // Show temporary downloading feedback
      const originalText = btnCardDownload.innerHTML;
      btnCardDownload.innerHTML = `
        <svg class="spinner-sm" viewBox="0 0 50 50" style="width:16px;height:16px;animation:spin 0.8s linear infinite;fill:none;stroke:#fff;stroke-width:5;">
          <circle cx="25" cy="25" r="20" stroke-dasharray="31.4 31.4"></circle>
        </svg>
        Downloading...
      `;
      btnCardDownload.style.pointerEvents = "none";

      // Build download URL
      const downloadUrl = `/api/download?url=${encodeURIComponent(currentVideoData.url)}&format_id=${encodeURIComponent(formatId)}&is_audio=${isAudio}&title=${encodeURIComponent(title)}`;

      // Trigger download via hidden link or iframe
      const dlLink = document.createElement("a");
      dlLink.href = downloadUrl;
      dlLink.setAttribute("download", "");
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      setTimeout(() => {
        btnCardDownload.innerHTML = originalText;
        btnCardDownload.style.pointerEvents = "auto";
      }, 4000);
    });
  }

  // 8. Helper UI states
  function showLoading() {
    resultSection.style.display = "block";
    loadingBox.style.display = "block";
    errorBox.style.display = "none";
    mediaResultCard.style.display = "none";
  }

  function showError(msg) {
    resultSection.style.display = "block";
    loadingBox.style.display = "none";
    errorBox.style.display = "flex";
    errorBox.textContent = `⚠️ ${msg}`;
    mediaResultCard.style.display = "none";
  }

  function hideResults() {
    resultSection.style.display = "none";
    loadingBox.style.display = "none";
    errorBox.style.display = "none";
    mediaResultCard.style.display = "none";
    currentVideoData = null;
  }

  // 9. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((f) => f.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });
});
