(() => {
  const announcementsList = document.getElementById('announcements-list');
  const announcementsMessage = document.getElementById('announcements-message');
  const announcementCount = document.getElementById('announcement-count');
  const readStoragePrefix = 'meal-planner-announcements-read:';
  const announcements = [
    {
      id: 'update-20261010',
      title: 'レシピタをアップデートしました',
      body: '材料の分量を人数に合わせて表示できるようになりました。レシピタのロゴを大きくし、アプリからアップデートのお知らせを確認できるようになりました。',
      publishedAt: '2026-10-10T00:00:00.000Z'
    }
  ];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function formatDate(value) {
    return new Date(value).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('meal-planner-current-user') || 'null');
    } catch (error) {
      console.warn('ログイン状態を確認できませんでした', error);
      return null;
    }
  }

  function getReadAnnouncementIds() {
    const user = getCurrentUser();
    if (!user) return [];

    try {
      const ids = JSON.parse(localStorage.getItem(`${readStoragePrefix}${user.id}`) || '[]');
      return Array.isArray(ids) ? ids : [];
    } catch (error) {
      console.warn('お知らせの既読状態を読み込めませんでした', error);
      return [];
    }
  }

  function setUnreadCount(count) {
    announcementCount.hidden = count === 0;
    announcementCount.textContent = count > 99 ? '99+' : String(count);
    announcementCount.title = count ? `${count}件の未読のお知らせ` : '未読のお知らせはありません';
  }

  function refreshCount() {
    const readIds = new Set(getReadAnnouncementIds());
    setUnreadCount(announcements.filter((item) => !readIds.has(item.id)).length);
  }

  function loadMine() {
    announcementsMessage.textContent = '';
    if (!announcements.length) {
      announcementsList.innerHTML = '<p class="empty-message">現在お知らせはありません。</p>';
    } else {
      announcementsList.innerHTML = announcements.map((item) => `
        <article class="announcement-card">
          <time datetime="${escapeHtml(item.publishedAt)}">${escapeHtml(formatDate(item.publishedAt))}</time>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `).join('');
    }

    const user = getCurrentUser();
    if (user) {
      localStorage.setItem(`${readStoragePrefix}${user.id}`, JSON.stringify(announcements.map((item) => item.id)));
    }
    setUnreadCount(0);
  }

  window.announcementsManager = { loadMine, refreshCount };
})();
