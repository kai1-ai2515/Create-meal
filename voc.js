(() => {
  const supabaseClient = window.mealSupabaseClient;
  const vocForm = document.getElementById('voc-submit-form');
  const vocCategory = document.getElementById('voc-category');
  const vocSubject = document.getElementById('voc-subject');
  const vocMessage = document.getElementById('voc-message');
  const vocCharacterCount = document.getElementById('voc-character-count');
  const vocSubmitButton = document.getElementById('voc-submit-btn');
  const vocSubmitMessage = document.getElementById('voc-submit-message');
  const myVocList = document.getElementById('my-voc-list');
  const vocAdminPage = document.getElementById('voc-admin-page');
  const closeVocAdminButton = document.getElementById('close-voc-admin-btn');
  const vocInboxTab = document.getElementById('voc-inbox-tab');
  const vocTrashTab = document.getElementById('voc-trash-tab');
  const vocSearch = document.getElementById('voc-search');
  const vocStatusFilter = document.getElementById('voc-status-filter');
  const vocRefreshButton = document.getElementById('voc-refresh-btn');
  const vocTotalCount = document.getElementById('voc-total-count');
  const vocAdminMessage = document.getElementById('voc-admin-message');
  const vocTableBody = document.getElementById('voc-table-body');
  const vocLogoutButton = document.getElementById('voc-logout-btn');
  let currentView = 'inbox';

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
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  async function getAuthenticatedUser() {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async function loadMine() {
    if (!myVocList) return;
    if (!supabaseClient) {
      myVocList.innerHTML = '<p class="empty-message">Supabaseの接続設定後に利用できます。</p>';
      return;
    }

    try {
      const user = await getAuthenticatedUser();
      if (!user) {
        myVocList.innerHTML = '<p class="empty-message">ログインしてください。</p>';
        return;
      }

      const { data, error } = await supabaseClient
        .from('voc_messages')
        .select('id, category, subject, message, status, created_at')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;

      if (!data.length) {
        myVocList.innerHTML = '<p class="empty-message">お問い合わせはまだありません。</p>';
        return;
      }

      myVocList.innerHTML = data.map((item) => `
        <article class="my-voc-item">
          <div class="my-voc-item-heading">
            <strong>${escapeHtml(item.subject)}</strong>
            <span class="voc-status-pill">${escapeHtml(item.status)}</span>
          </div>
          <time datetime="${escapeHtml(item.created_at)}">${escapeHtml(formatDate(item.created_at))} · ${escapeHtml(item.category)}</time>
          <p>${escapeHtml(item.message)}</p>
        </article>
      `).join('');
    } catch (error) {
      console.error('VOC履歴を取得できませんでした', error);
      myVocList.innerHTML = '<p class="empty-message">お問い合わせ履歴を読み込めませんでした。時間をおいて再度お試しください。</p>';
    }
  }

  async function submitVoc(event) {
    event.preventDefault();
    if (!supabaseClient) {
      vocSubmitMessage.textContent = 'Supabaseの接続設定後に送信できます。';
      return;
    }

    const subject = vocSubject.value.trim();
    const message = vocMessage.value.trim();
    if (!subject || !message) {
      vocSubmitMessage.textContent = '件名と内容を入力してください。';
      return;
    }

    vocSubmitButton.disabled = true;
    vocSubmitMessage.textContent = '送信しています...';
    try {
      const { error } = await supabaseClient.from('voc_messages').insert({
        category: vocCategory.value,
        subject,
        message
      });
      if (error) throw error;
      vocForm.reset();
      vocCharacterCount.textContent = '0 / 4000';
      vocSubmitMessage.textContent = '送信しました。マイページから対応状況を確認できます。';
      await loadMine();
    } catch (error) {
      console.error('VOCを送信できませんでした', error);
      vocSubmitMessage.textContent = '送信できませんでした。時間をおいて再度お試しください。';
    } finally {
      vocSubmitButton.disabled = false;
    }
  }

  function setCurrentView(view) {
    currentView = view;
    const showingInbox = view === 'inbox';
    vocInboxTab.classList.toggle('is-active', showingInbox);
    vocInboxTab.setAttribute('aria-pressed', String(showingInbox));
    vocTrashTab.classList.toggle('is-active', !showingInbox);
    vocTrashTab.setAttribute('aria-pressed', String(!showingInbox));
    renderAdminList();
  }

  function renderRows(items) {
    if (!items.length) {
      vocTableBody.innerHTML = `<tr><td colspan="5" class="empty-message">${currentView === 'inbox' ? '受信箱にVOCはありません。' : 'ゴミ箱は空です。'}</td></tr>`;
      return;
    }

    vocTableBody.innerHTML = items.map((item) => {
      const actions = currentView === 'inbox'
        ? `<select data-voc-status="${item.id}" aria-label="${escapeHtml(item.subject)}の対応状況">
             ${['未対応', '対応中', '対応済み'].map((status) => `<option value="${status}" ${item.status === status ? 'selected' : ''}>${status}</option>`).join('')}
           </select>
           <label><input type="checkbox" data-voc-archive="${item.id}" /><span>修正後にゴミ箱へ</span></label>`
        : `<button type="button" class="secondary-btn" data-voc-restore="${item.id}">受信箱に戻す</button>
           <button type="button" class="danger-btn" data-voc-delete="${item.id}">完全削除</button>`;
      return `
        <tr>
          <td class="voc-date-cell">${escapeHtml(formatDate(item.created_at))}</td>
          <td class="voc-user-cell">${escapeHtml(item.user_email)}</td>
          <td class="voc-content-cell"><strong>${escapeHtml(item.subject)}</strong><span class="voc-status-pill">${escapeHtml(item.category)}</span><p>${escapeHtml(item.message)}</p></td>
          <td><span class="voc-status-pill">${escapeHtml(item.status)}</span></td>
          <td class="voc-row-actions">${actions}</td>
        </tr>`;
    }).join('');
  }

  async function renderAdminList() {
    if (!vocAdminPage || vocAdminPage.hidden || !vocTableBody) return;
    if (!supabaseClient) {
      vocAdminMessage.textContent = 'Supabaseの接続設定が必要です。';
      return;
    }

    vocAdminMessage.textContent = 'VOCを読み込んでいます...';
    try {
      const user = await getAuthenticatedUser();
      if (!user) throw new Error('ログインしてください。');
      const { data: isDeveloper, error: roleError } = await supabaseClient.rpc('is_current_user_developer');
      if (roleError || !isDeveloper) throw new Error('開発者権限を確認できません。');

      let query = supabaseClient.from('voc_messages').select('*').order('created_at', { ascending: false }).limit(500);
      query = currentView === 'inbox' ? query.is('archived_at', null) : query.not('archived_at', 'is', null);
      if (vocStatusFilter.value !== 'all') query = query.eq('status', vocStatusFilter.value);
      const { data, error } = await query;
      if (error) throw error;

      const search = vocSearch.value.trim().toLocaleLowerCase('ja');
      const filtered = search
        ? data.filter((item) => [item.user_email, item.subject, item.message, item.category].some((value) => String(value).toLocaleLowerCase('ja').includes(search)))
        : data;
      vocTotalCount.textContent = `${filtered.length}件`;
      renderRows(filtered);
      vocAdminMessage.textContent = '';
    } catch (error) {
      console.error('VOC一覧を取得できませんでした', error);
      vocTotalCount.textContent = '0件';
      vocTableBody.innerHTML = '<tr><td colspan="5" class="empty-message">一覧を読み込めませんでした。接続設定と権限を確認してください。</td></tr>';
      vocAdminMessage.textContent = error.message || 'VOC一覧を取得できませんでした。';
    }
  }

  async function updateVoc(id, changes) {
    const { error } = await supabaseClient.from('voc_messages').update(changes).eq('id', id);
    if (error) throw error;
    await renderAdminList();
  }

  vocForm.addEventListener('submit', submitVoc);
  vocMessage.addEventListener('input', () => {
    vocCharacterCount.textContent = `${vocMessage.value.length} / 4000`;
  });
  vocInboxTab.addEventListener('click', () => setCurrentView('inbox'));
  vocTrashTab.addEventListener('click', () => setCurrentView('trash'));
  vocSearch.addEventListener('input', renderAdminList);
  vocStatusFilter.addEventListener('change', renderAdminList);
  vocRefreshButton.addEventListener('click', renderAdminList);
  closeVocAdminButton.addEventListener('click', () => {
    vocAdminPage.hidden = true;
    document.querySelector('.content').hidden = false;
  });
  vocLogoutButton.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  vocTableBody.addEventListener('change', async (event) => {
    const statusSelect = event.target.closest('[data-voc-status]');
    const archiveCheckbox = event.target.closest('[data-voc-archive]');
    try {
      if (statusSelect) await updateVoc(statusSelect.dataset.vocStatus, { status: statusSelect.value });
      if (archiveCheckbox && archiveCheckbox.checked) {
        await updateVoc(archiveCheckbox.dataset.vocArchive, {
          status: '対応済み',
          archived_at: new Date().toISOString()
        });
      }
    } catch (error) {
      vocAdminMessage.textContent = error.message || 'VOCを更新できませんでした。';
      await renderAdminList();
    }
  });

  vocTableBody.addEventListener('click', async (event) => {
    const restoreButton = event.target.closest('[data-voc-restore]');
    const deleteButton = event.target.closest('[data-voc-delete]');
    try {
      if (restoreButton) await updateVoc(restoreButton.dataset.vocRestore, { archived_at: null });
      if (deleteButton && window.confirm('このVOCを完全に削除しますか？この操作は取り消せません。')) {
        const { error } = await supabaseClient.from('voc_messages').delete().eq('id', deleteButton.dataset.vocDelete);
        if (error) throw error;
        await renderAdminList();
      }
    } catch (error) {
      vocAdminMessage.textContent = error.message || 'VOCを処理できませんでした。';
      await renderAdminList();
    }
  });

  window.vocManager = { loadMine, loadAdmin: renderAdminList };
})();