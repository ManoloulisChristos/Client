export default function getTextSizeInKB(text) {
  let bytes = new TextEncoder().encode(text).length;
  return bytes / 1024; // Convert bytes to KB
}
