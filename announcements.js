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
  const announcementAdminCount = document.getElementById('announcement-admin-count');
  const announcementRefreshButton = document.getElementById('announcement-refresh-btn');
  const supabaseClient = window.mealSupabaseClient || null;
  const readStoragePrefix = 'meal-planner-announcements-read:';
  const developerPasswordStorageKey = 'meal-planner-developer-password';
  const staticAnnouncements = [
    {
      id: 'update-20261010',
      title: 'レシピタをアップデートしました',
      body: '材料の分量を人数に合わせて表示できるようになりました。レシピタのロゴを大きくし、アプリからアップデートのお知らせを確認できるようになりました。',
      published_at: '2026-10-10T00:00:00.000Z'
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

  async function fetchAnnouncements() {
    if (!supabaseClient) return [];

    const { data, error } = await supabaseClient
      .from('announcements')
      .select('id, title, body, published_at')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  }

  async function refreshCount() {
    try {
      const items = [...staticAnnouncements, ...await fetchAnnouncements()];
      const readIds = new Set(getReadAnnouncementIds());
      setUnreadCount(items.filter((item) => !readIds.has(item.id)).length);
    } catch (error) {
      console.error('お知らせ件数を取得できませんでした', error);
      announcementCount.hidden = false;
      announcementCount.textContent = '!';
      announcementCount.title = 'お知らせを取得できません。お知らせページを開いて詳細を確認してください。';
    }
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

  async function loadMine() {
    announcementsMessage.textContent = 'お知らせを読み込んでいます...';
    announcementsList.innerHTML = '';
    try {
      const items = [...staticAnnouncements, ...await fetchAnnouncements()]
        .sort((left, right) => new Date(right.published_at) - new Date(left.published_at));
      renderPublicAnnouncements(items);
      announcementsMessage.textContent = supabaseClient
        ? ''
        : 'サーバー配信は未設定です。現在はアプリに含まれるお知らせを表示しています。';
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

  async function callDeveloperFunction(method, body) {
    if (!supabaseClient) {
      throw new Error('SupabaseのURLと公開キーを設定してから配信してください。');
    }

    const developerPassword = sessionStorage.getItem(developerPasswordStorageKey);
    if (!developerPassword) throw new Error('開発者ログインの有効期限が切れました。再ログインしてください。');

    const { data, error } = await supabaseClient.functions.invoke('developer-announcements', {
      method,
      headers: { 'x-developer-password': developerPassword },
      ...(body ? { body } : {})
    });
    if (error) throw error;
    return data;
  }

  async function authenticateDeveloper(password) {
    if (!supabaseClient) {
      throw new Error('開発者ログインを利用するにはSupabaseの設定が必要です。');
    }

    const { error } = await supabaseClient.functions.invoke('developer-announcements', {
      method: 'GET',
      headers: { 'x-developer-password': password }
    });
    if (error) throw new Error('パスワードが違うか、開発者配信サーバーが未設定です。');
    return true;
  }

  function renderAdminAnnouncements(items) {
    announcementAdminCount.textContent = String(items.length);
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

  async function loadAdmin() {
    announcementAdminMessage.textContent = '配信履歴を読み込んでいます...';
    announcementAdminList.innerHTML = '';
    try {
      const data = await callDeveloperFunction('GET');
      renderAdminAnnouncements(data.announcements || []);
      announcementAdminMessage.textContent = '';
      return true;
    } catch (error) {
      console.error('お知らせ管理を読み込めませんでした', error);
      announcementAdminCount.textContent = '--';
      announcementAdminMessage.textContent = error.message || '配信履歴を取得できませんでした。';
      announcementAdminList.innerHTML = '<p class="empty-message">配信履歴を読み込めませんでした。</p>';
      return false;
    }
  }

  async function submitAnnouncement(event) {
    event.preventDefault();
    const title = announcementTitle.value.trim();
    const body = announcementBody.value.trim();
    if (!title || !body) {
      announcementAdminMessage.textContent = 'タイトルとメッセージを入力してください。';
      return;
    }
    if (!window.confirm(`「${title}」を全ユーザーへ配信しますか？`)) return;

    announcementSubmitButton.disabled = true;
    announcementAdminMessage.textContent = '全ユーザーへ配信しています...';
    try {
      await callDeveloperFunction('POST', { title, body });
      announcementForm.reset();
      const refreshed = await loadAdmin();
      announcementAdminMessage.textContent = refreshed
        ? 'お知らせを全ユーザーへ配信しました。'
        : '配信は完了しましたが、一覧を更新できませんでした。画面を更新して確認してください。';
      await refreshCount();
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
      await callDeveloperFunction('DELETE', { id });
      await loadAdmin();
      await refreshCount();
    } catch (error) {
      console.error('お知らせを削除できませんでした', error);
      announcementAdminMessage.textContent = error.message || 'お知らせを削除できませんでした。';
    }
  }

  announcementForm.addEventListener('submit', submitAnnouncement);
  announcementRefreshButton.addEventListener('click', loadAdmin);
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

  window.announcementsManager = { authenticateDeveloper, loadMine, loadAdmin, refreshCount };
})();
