// share.js

function shareOnFacebook() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    window.open(shareUrl, '_blank');
}

function shareOnTwitter() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(document.title);
    const shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
    window.open(shareUrl, '_blank');
}

function shareOnLinkedIn() {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    window.open(shareUrl, '_blank');
}
