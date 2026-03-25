
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("profileImage");
  const form = document.getElementById("uploadForm");
 

  if (!fileInput || !form) return;

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length === 0) return;
    console.log("Submitting...");
    
      form.submit();
    
  });
});
