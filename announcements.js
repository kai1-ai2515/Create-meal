(() => {
  const announcementsList = document.getElementById('announcements-list');
  const announcementsMessage = document.getElementById('announcements-message');
  const announcementCount = document.getElementById('announcement-count');
  const announcementForm = document.getElementById('announcement-form');
  const announcementTitle = document.getElementById('announcement-title');
  const announcementBody = document.getElementById('announcement-body');
  const announcementSubmitButton = document.getElementById('announcement-submit-btn');
  const announcementAdminMessage = document.getElementById('announcement-admin-message');
  const announcementAdminList = document.getElementById('announcement-admin-list');
  const supabaseClient = window.mealSupabaseClient || null;
  const readStoragePrefix = 'meal-planner-announcements-read:';

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

  async function fetchPublishedAnnouncements() {
    if (!supabaseClient) {
      throw new Error('お知らせ配信を利用するにはSupabaseのURL・anon key設定が必要です。');
    }

    const { data, error } = await supabaseClient
      .from('announcements')
      .select('id, title, body, published_at')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  }

  function renderPublicAnnouncements(items) {
    if (!items.length) {
      announcementsList.innerHTML = '<p class="empty-message">現在お知らせはありません。</p>';
      return;
    }

    announcementsList.innerHTML = items.map((item) => `
      <article class="announcement-card">
        <time datetime="${escapeHtml(item.published_at)}">${escapeHtml(formatDate(item.published_at))}</time>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join('');
  }

  async function refreshCount() {
    try {
      const items = await fetchPublishedAnnouncements();
      const readIds = new Set(getReadAnnouncementIds());
      setUnreadCount(items.filter((item) => !readIds.has(item.id)).length);
    } catch (error) {
      console.error('お知らせ件数を取得できませんでした', error);
      announcementCount.hidden = false;
      announcementCount.textContent = '!';
      announcementCount.title = 'お知らせを取得できません。お知らせページを開いて詳細を確認してください。';
    }
  }

  async function loadMine() {
    announcementsMessage.textContent = 'お知らせを読み込んでいます...';
    announcementsList.innerHTML = '';
    try {
      const items = await fetchPublishedAnnouncements();
      renderPublicAnnouncements(items);
      announcementsMessage.textContent = '';
      const user = getCurrentUser();
      if (user) {
        localStorage.setItem(`${readStoragePrefix}${user.id}`, JSON.stringify(items.map((item) => item.id)));
      }
      setUnreadCount(0);
    } catch (error) {
      console.error('お知らせを取得できませんでした', error);
      announcementsMessage.textContent = error.message || 'お知らせを取得できませんでした。時間をおいて再度お試しください。';
      announcementsList.innerHTML = '<p class="empty-message">お知らせを読み込めませんでした。</p>';
    }
  }

  async function getDeveloperUser() {
    if (!supabaseClient) {
      throw new Error('お知らせを配信するにはSupabaseのURL・anon key設定が必要です。');
    }

    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    if (data.user?.app_metadata?.role !== 'developer') {
      throw new Error('Supabase Authで開発者ロールが設定されたアカウントでログインしてください。');
    }
    return data.user;
  }

  function renderAdminAnnouncements(items) {
    if (!items.length) {
      announcementAdminList.innerHTML = '<p class="empty-message">送信済みのお知らせはありません。</p>';
      return;
    }

    announcementAdminList.innerHTML = items.map((item) => `
      <article class="announcement-card announcement-admin-card">
        <div class="announcement-card-meta">
          <time datetime="${escapeHtml(item.published_at)}">${escapeHtml(formatDate(item.published_at))}</time>
          <button type="button" class="delete-bookmark-btn" data-delete-announcement="${escapeHtml(item.id)}">削除</button>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join('');
  }

  async function loadAdmin(preserveMessage = false) {
    if (!preserveMessage) announcementAdminMessage.textContent = '送信済みのお知らせを読み込んでいます...';
    announcementAdminList.innerHTML = '';
    try {
      await getDeveloperUser();
      const { data, error } = await supabaseClient
        .from('announcements')
        .select('id, title, body, published_at')
        .order('published_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      renderAdminAnnouncements(data || []);
      if (!preserveMessage) announcementAdminMessage.textContent = '';
      return true;
    } catch (error) {
      console.error('お知らせ管理を読み込めませんでした', error);
      announcementAdminMessage.textContent = error.message || '送信済みのお知らせを取得できませんでした。';
      announcementAdminList.innerHTML = '<p class="empty-message">一覧を読み込めませんでした。</p>';
      return false;
    }
  }

  async function submitAnnouncement(event) {
    event.preventDefault();
    const title = announcementTitle.value.trim();
    const body = announcementBody.value.trim();
    if (!title || !body) {
      announcementAdminMessage.textContent = 'タイトルと内容を入力してください。';
      return;
    }

    announcementSubmitButton.disabled = true;
    announcementAdminMessage.textContent = '全ユーザーへ配信しています...';
    try {
      const user = await getDeveloperUser();
      const { error } = await supabaseClient
        .from('announcements')
        .insert({ title, body, created_by: user.id });
      if (error) throw error;
      announcementForm.reset();
      const refreshed = await loadAdmin(true);
      const refreshError = refreshed ? '' : ` ${announcementAdminMessage.textContent}`;
      announcementAdminMessage.textContent = refreshed
        ? 'お知らせを全ユーザーへ配信しました。'
        : `お知らせは配信されましたが、送信済み一覧を更新できませんでした。${refreshError}`;
    } catch (error) {
      console.error('お知らせを配信できませんでした', error);
      announcementAdminMessage.textContent = error.message || 'お知らせを配信できませんでした。Supabaseの設定とRLSを確認してください。';
    } finally {
      announcementSubmitButton.disabled = false;
    }
  }

  async function deleteAnnouncement(id) {
    if (!window.confirm('このお知らせを削除しますか？ユーザーのお知らせページからも削除されます。')) return;

    announcementAdminMessage.textContent = 'お知らせを削除しています...';
    try {
      await getDeveloperUser();
      const { error } = await supabaseClient
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
      const refreshed = await loadAdmin(true);
      const refreshError = refreshed ? '' : ` ${announcementAdminMessage.textContent}`;
      announcementAdminMessage.textContent = refreshed
        ? 'お知らせを削除しました。'
        : `お知らせは削除されましたが、一覧を更新できませんでした。${refreshError}`;
    } catch (error) {
      console.error('お知らせを削除できませんでした', error);
      announcementAdminMessage.textContent = error.message || 'お知らせを削除できませんでした。';
    }
  }

  announcementForm.addEventListener('submit', submitAnnouncement);
  announcementAdminList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-announcement]');
    if (button) deleteAnnouncement(button.dataset.deleteAnnouncement);
  });

  if (supabaseClient) {
    const refreshCountWhenVisible = () => {
      const appShell = document.querySelector('.app-shell');
      if (!document.hidden && appShell && !appShell.hidden) refreshCount();
    };
    window.setInterval(refreshCountWhenVisible, 60000);
    document.addEventListener('visibilitychange', refreshCountWhenVisible);
  }

  window.announcementsManager = { loadMine, loadAdmin, refreshCount };
})();
