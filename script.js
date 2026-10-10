const form = document.getElementById('meal-form');
const resultPanel = document.getElementById('result-panel');
const bookmarksList = document.getElementById('bookmarks-list');
const clearBookmarksButton = document.getElementById('clear-bookmarks-btn');
const openBookmarksButton = document.getElementById('open-bookmarks-btn');
const closeBookmarksButton = document.getElementById('close-bookmarks-btn');
const bookmarkCount = document.getElementById('bookmark-count');
const plannerView = document.querySelector('.content');
const bookmarksPage = document.getElementById('bookmarks-page');
const recipeSearchInput = document.getElementById('recipe-search-input');
const recipeSearchResults = document.getElementById('recipe-search-results');
const recipeSearchCount = document.getElementById('recipe-search-count');
const recipeSearchHint = document.getElementById('recipe-search-hint');
const shoppingPage = document.getElementById('shopping-page');
const historyPage = document.getElementById('history-page');
const openShoppingButton = document.getElementById('open-shopping-btn');
const openHistoryButton = document.getElementById('open-history-btn');
const openAnnouncementsButton = document.getElementById('open-announcements-btn');
const closeShoppingButton = document.getElementById('close-shopping-btn');
const closeHistoryButton = document.getElementById('close-history-btn');
const closeAnnouncementsButton = document.getElementById('close-announcements-btn');
const shoppingList = document.getElementById('shopping-list');
const historyList = document.getElementById('history-list');
const announcementsPage = document.getElementById('announcements-page');
const clearHistoryButton = document.getElementById('clear-history-btn');
const historyCount = document.getElementById('history-count');
const mealDetailPage = document.getElementById('meal-detail-page');
const mealDetailContent = document.getElementById('meal-detail-content');
const closeMealDetailButton = document.getElementById('close-meal-detail-btn');
const fridgePage = document.getElementById('fridge-page');
const openFridgeButton = document.getElementById('open-fridge-btn');
const closeFridgeButton = document.getElementById('close-fridge-btn');
const fridgeIngredients = document.getElementById('fridge-ingredients');
const otherFridgeButton = document.getElementById('other-fridge-btn');
const fridgeOtherForm = document.getElementById('fridge-other-form');
const fridgeOtherInput = document.getElementById('fridge-other-input');
const addFridgeOtherButton = document.getElementById('add-fridge-other-btn');
const fridgeOtherList = document.getElementById('fridge-other-list');
const findFridgeMealsButton = document.getElementById('find-fridge-meals-btn');
const clearFridgeButton = document.getElementById('clear-fridge-btn');
const fridgeResults = document.getElementById('fridge-results');
const healthMonth = document.getElementById('health-month');
const healthMeter = document.querySelector('.health-meter');
const healthMeterFill = document.getElementById('health-meter-fill');
const healthScore = document.getElementById('health-score');
const healthLevel = document.getElementById('health-level');
const healthDelta = document.getElementById('health-delta');
const healthComment = document.getElementById('health-comment');
const healthLogCount = document.getElementById('health-log-count');
const healthTrendChart = document.getElementById('health-trend-chart');
const recordHealthButton = document.getElementById('record-health-btn');
const manageHealthLogsButton = document.getElementById('manage-health-logs-btn');
const healthLogPage = document.getElementById('health-log-page');
const closeHealthLogButton = document.getElementById('close-health-log-btn');
const clearHealthLogsButton = document.getElementById('clear-health-logs-btn');
const healthLogList = document.getElementById('health-log-list');
const authView = document.getElementById('auth-view');
const authForm = document.getElementById('auth-form');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authPasswordLabel = document.getElementById('auth-password-label');
const authSubmitButton = document.getElementById('auth-submit-btn');
const authSwitchButton = document.getElementById('auth-switch-btn');
const devLoginButton = document.getElementById('dev-login-btn');
const authBackButton = document.getElementById('auth-back-btn');
const emailField = document.getElementById('email-field');
const authMessage = document.getElementById('auth-message');
const currentUserName = document.getElementById('current-user-name');
const mypageButton = document.getElementById('mypage-btn');
const mypagePanel = document.getElementById('mypage-panel');
const mypageForm = document.getElementById('mypage-form');
const mypageEmailInput = document.getElementById('mypage-email');
const mypageCreatedAt = document.getElementById('mypage-created-at');
const mypageCurrentPasswordInput = document.getElementById('mypage-current-password');
const mypageNewPasswordInput = document.getElementById('mypage-new-password');
const mypageNewPasswordConfirmInput = document.getElementById('mypage-new-password-confirm');
const mypageMessage = document.getElementById('mypage-message');
const closeMypageButton = document.getElementById('close-mypage-btn');
const logoutFromMypageButton = document.getElementById('logout-from-mypage-btn');
const exportDataButton = document.getElementById('export-data-btn');
const resetLocalDataButton = document.getElementById('reset-local-data-btn');
const deleteAccountPasswordInput = document.getElementById('delete-account-password');
const deleteAccountButton = document.getElementById('delete-account-btn');
const vocAdminPage = document.getElementById('voc-admin-page');
const announcementAdminPage = document.getElementById('announcement-admin-page');
const registrantsPage = document.getElementById('registrants-page');
const openAnnouncementAdminButton = document.getElementById('open-announcement-admin-btn');
const closeAnnouncementAdminButton = document.getElementById('close-announcement-admin-btn');
const announcementRefreshButton = document.getElementById('announcement-refresh-btn');
const openRegistrantsButton = document.getElementById('open-registrants-btn');
const closeRegistrantsButton = document.getElementById('close-registrants-btn');
const registrantsSearch = document.getElementById('registrants-search');
const registrantsRefreshButton = document.getElementById('registrants-refresh-btn');
const registrantsExportButton = document.getElementById('registrants-export-btn');
const registrantsCount = document.getElementById('registrants-count');
const registrantsMessage = document.getElementById('registrants-message');
const registrantsTableBody = document.getElementById('registrants-table-body');
const appShell = document.querySelector('.app-shell');
const userDataStoragePrefix = 'meal-planner-user-data:';
const localAccountsStorageKey = 'meal-planner-accounts';
const localCurrentUserStorageKey = 'meal-planner-current-user';
const developerPasswordStorageKey = 'meal-planner-developer-password';
const supabaseClient = window.mealSupabaseClient || null;
let authMode = 'signin';
let currentUser = null;
let vocCurrentView = 'inbox';

function getSafeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getUserDataKey(email) {
  return `${userDataStoragePrefix}${encodeURIComponent(getSafeEmail(email))}`;
}

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(user) {
  currentUser = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt || user.created_at || null,
    role: user.role || 'user'
  };
}

function clearCurrentUser() {
  currentUser = null;
}

function getStoredAccounts() {
  try {
    return JSON.parse(localStorage.getItem(localAccountsStorageKey)) || [];
  } catch (error) {
    console.warn('アカウント一覧を読み込めませんでした', error);
    return [];
  }
}

function saveStoredAccounts(accounts) {
  localStorage.setItem(localAccountsStorageKey, JSON.stringify(accounts));
}

function getStoredCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(localCurrentUserStorageKey));
  } catch (error) {
    console.warn('ログイン状態を読み込めませんでした', error);
    return null;
  }
}

function setStoredCurrentUser(user) {
  localStorage.setItem(localCurrentUserStorageKey, JSON.stringify(user));
}

function clearStoredCurrentUser() {
  localStorage.removeItem(localCurrentUserStorageKey);
}

function loadUserData() {
  const user = getCurrentUser();
  if (!user) {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem(getUserDataKey(user.email))) || {};
  } catch (error) {
    console.warn('ユーザーデータを読み込めませんでした', error);
    return {};
  }
}

function saveUserData(data) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }
  localStorage.setItem(getUserDataKey(user.email), JSON.stringify(data));
}

function getUserDataValue(key, fallback) {
  const data = loadUserData();
  return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
}

function setUserDataValue(key, value) {
  const data = loadUserData();
  data[key] = value;
  saveUserData(data);
}

function syncCurrentUserBadge() {
  const user = getCurrentUser();
  currentUserName.textContent = user ? user.email : '未ログイン';
}

function formatCreatedAt(dateString) {
  if (!dateString) return '未設定';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '未設定';
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

function setPasswordVisibility(inputId, visible) {
  const target = document.getElementById(inputId);
  if (!target) return;
  target.type = visible ? 'text' : 'password';
}

function renderMypageProfile() {
  const user = getCurrentUser();
  if (!user) {
    mypageCreatedAt.textContent = '未設定';
    mypageEmailInput.value = '';
    mypageCurrentPasswordInput.value = '';
    mypageNewPasswordInput.value = '';
    mypageNewPasswordConfirmInput.value = '';
    return;
  }

  mypageCreatedAt.textContent = formatCreatedAt(user.createdAt);
  mypageEmailInput.value = user.email;
  mypageCurrentPasswordInput.value = '';
  mypageNewPasswordInput.value = '';
  mypageNewPasswordConfirmInput.value = '';
  deleteAccountPasswordInput.value = '';
}

function setAuthMode(nextMode) {
  authMode = nextMode;
  const isDeveloperMode = nextMode === 'developer';
  emailField.hidden = isDeveloperMode;
  emailField.classList.remove('hidden');
  authEmailInput.required = !isDeveloperMode;
  authEmailInput.disabled = isDeveloperMode;
  authEmailInput.placeholder = 'name@gmail.com';
  authPasswordInput.minLength = isDeveloperMode ? 16 : 6;
  authPasswordInput.maxLength = isDeveloperMode ? 128 : 32;
  authPasswordInput.autocomplete = 'current-password';
  authPasswordInput.placeholder = isDeveloperMode ? '開発者パスワード' : '6文字以上';
  authPasswordLabel.textContent = isDeveloperMode ? '開発者パスワード' : 'パスワード';
  authForm.noValidate = false;
  authSubmitButton.textContent = isDeveloperMode ? '開発者ログイン' : nextMode === 'signin' ? 'サインイン' : 'サインアップ';
  authSwitchButton.hidden = isDeveloperMode;
  devLoginButton.hidden = isDeveloperMode;
  authBackButton.hidden = !isDeveloperMode;
  authMessage.textContent = nextMode === 'developer'
    ? 'メールアドレス不要です。開発者専用パスワードを入力してください。'
    : nextMode === 'signin'
      ? '登録済みのメールアドレスでサインインします。'
      : '新しいメールアドレスでアカウントを作成します。';
}

function showAuthView(message = '') {
  authMessage.textContent = message;
  authView.hidden = false;
  appShell.hidden = true;
  if (authMode === 'developer') authPasswordInput.focus();
  else authEmailInput.focus();
}

function showAppView() {
  syncCurrentUserBadge();
  mypageButton.textContent = getCurrentUser()?.role === 'developer' ? '開発者コンソール' : 'マイページ';
  authView.hidden = true;
  appShell.hidden = false;
  renderUserData();
  window.announcementsManager?.refreshCount();
}

function completeSuccessfulLogin(user) {
  setCurrentUser(user);
  setStoredCurrentUser(user);
  authForm.reset();
  authPasswordInput.value = '';
  showAppView();
  if (currentUser.role === 'developer') openVocAdminPage();
  else openMypage();
}

function renderUserData() {
  renderBookmarks();
  renderHistory();
  renderHealthMaster();
  renderHealthLogs();
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const email = authEmailInput.value.trim();
  const password = authMode === 'developer'
    ? authPasswordInput.value
    : authPasswordInput.value.trim();

  if (authMode === 'developer') {
    if (!password) {
      authMessage.textContent = '開発者パスワードを入力してください。';
      return;
    }
    if (password.length < 16) {
      authMessage.textContent = '開発者パスワードは16文字以上にしてください。';
      return;
    }
    if (!supabaseClient) {
      authMessage.textContent = '開発者ログインにはSupabaseの設定が必要です。';
      return;
    }

    authSubmitButton.disabled = true;
    authMessage.textContent = '開発者パスワードを確認しています...';
    try {
      await window.announcementsManager.authenticateDeveloper(password);
      sessionStorage.setItem(developerPasswordStorageKey, password);
      completeSuccessfulLogin({
        id: 'developer-console',
        email: '開発者',
        createdAt: new Date().toISOString(),
        role: 'developer'
      });
    } catch (error) {
      console.error('開発者ログインに失敗しました', error);
      authMessage.textContent = error.message || '開発者ログインに失敗しました。パスワードとサーバー設定を確認してください。';
    } finally {
      authSubmitButton.disabled = false;
    }
    return;
  }

  if (!email || !password) {
    authMessage.textContent = 'メールアドレスとパスワードを入力してください。';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    authMessage.textContent = '正しいメールアドレスを入力してください。';
    return;
  }

  if (password.length < 6) {
    authMessage.textContent = 'パスワードは6文字以上で入力してください。';
    return;
  }

  if (supabaseClient) {
    try {
      const normalizedEmail = getSafeEmail(email);
      const request = authMode === 'signup'
        ? await supabaseClient.auth.signUp({ email: normalizedEmail, password })
        : await supabaseClient.auth.signInWithPassword({ email: normalizedEmail, password });

      if (request.error) {
        authMessage.textContent = request.error.message || '認証に失敗しました。';
        return;
      }

      const authUser = request.data?.user || request.data?.session?.user;
      if (!authUser) {
        authMessage.textContent = '認証情報を確認できませんでした。';
        return;
      }

      completeSuccessfulLogin({
        id: authUser.id,
        email: authUser.email,
        createdAt: authUser.created_at,
        role: 'user'
      });
      return;
    } catch (error) {
      console.warn('Supabase認証に失敗したため、ローカル認証へ切り替えます。', error);
    }
  }

  const normalizedEmail = getSafeEmail(email);
  const accounts = getStoredAccounts();

  if (authMode === 'signup') {
    if (accounts.some((account) => getSafeEmail(account.email) === normalizedEmail)) {
      authMessage.textContent = 'このメールアドレスはすでに登録されています。';
      return;
    }

    const newAccount = {
      id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
      role: 'user'
    };

    accounts.push(newAccount);
    saveStoredAccounts(accounts);
    completeSuccessfulLogin({
      id: newAccount.id,
      email: newAccount.email,
      createdAt: newAccount.createdAt,
      role: 'user'
    });
    return;
  }

  const matchingAccount = accounts.find((account) => getSafeEmail(account.email) === normalizedEmail && account.password === password);
  if (!matchingAccount) {
    authMessage.textContent = 'メールアドレスまたはパスワードが違います。';
    return;
  }

  completeSuccessfulLogin({
    id: matchingAccount.id,
    email: matchingAccount.email,
    createdAt: matchingAccount.createdAt,
    role: matchingAccount.role || 'user'
  });
}

async function handleLogout() {
  if (supabaseClient && currentUser?.role !== 'developer') {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('ログアウトできませんでした', error);
      mypageMessage.textContent = error.message || 'ログアウトできませんでした。時間をおいて再度お試しください。';
      return;
    }
  }

  clearStoredCurrentUser();
  sessionStorage.removeItem(developerPasswordStorageKey);
  clearCurrentUser();
  authForm.reset();
  mypageForm.reset();
  deleteAccountPasswordInput.value = '';
  setAuthMode('signin');
  syncCurrentUserBadge();
  mypagePanel.hidden = true;
  showAuthView('ログアウトしました。メールアドレスとパスワードで再度サインインしてください。');
}

function openMypage() {
  const user = getCurrentUser();
  if (!user) {
    showAuthView('マイページを開くにはログインしてください。');
    return;
  }
  if (user.role === 'developer') {
    openVocAdminPage();
    return;
  }

  hideSubpages();
  mypagePanel.hidden = false;
  plannerView.hidden = true;
  renderMypageProfile();
  mypageMessage.textContent = '';
  window.vocManager?.loadMine();
}

function closeMypage() {
  mypagePanel.hidden = true;
  showPlanner();
}

function openVocAdminPage() {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    showAuthView('開発者コンソールは開発者アカウントでログインしてください。');
    return;
  }

  hideSubpages();
  plannerView.hidden = true;
  vocAdminPage.hidden = false;
  window.vocManager?.loadAdmin();
  window.announcementsManager?.loadAdmin();
}

function openAnnouncementAdminPage() {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    showAuthView('お知らせ配信は開発者アカウントでログインしてください。');
    return;
  }

  hideSubpages();
  plannerView.hidden = true;
  announcementAdminPage.hidden = false;
  window.announcementsManager?.loadAdmin();
  document.getElementById('announcement-title').focus();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function formatRegistrantDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '未設定'
    : date.toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
}

function getLocalRegistrants() {
  return getStoredAccounts()
    .filter((account) => account.role !== 'developer')
    .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));
}

function renderRegistrants() {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    registrantsCount.textContent = '0件';
    registrantsTableBody.innerHTML = '<tr><td colspan="3" class="empty-message">開発者ログインでのみ登録者情報を確認できます。</td></tr>';
    registrantsMessage.textContent = '開発者権限が必要です。';
    return;
  }

  const accounts = getLocalRegistrants();
  const query = registrantsSearch.value.trim().toLocaleLowerCase();
  const filteredAccounts = query
    ? accounts.filter((account) => String(account.email || '').toLocaleLowerCase().includes(query))
    : accounts;
  registrantsCount.textContent = `${filteredAccounts.length}件`;
  registrantsMessage.textContent = '';
  registrantsTableBody.innerHTML = filteredAccounts.length
    ? filteredAccounts.map((account) => `
        <tr>
          <td data-label="メールアドレス">${escapeHtml(account.email)}</td>
          <td data-label="登録日時">${escapeHtml(formatRegistrantDate(account.createdAt))}</td>
          <td data-label="操作"><button class="danger-btn" type="button" data-delete-registrant="${escapeHtml(account.id)}">登録を削除</button></td>
        </tr>
      `).join('')
    : `<tr><td colspan="3" class="empty-message">${query ? '検索条件に一致する登録者はいません。' : 'ローカル登録者はいません。'}</td></tr>`;
}

function exportRegistrantsCsv() {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    registrantsMessage.textContent = 'CSVの書き出しには開発者権限が必要です。';
    return;
  }

  const accounts = getLocalRegistrants();
  if (!accounts.length) {
    registrantsMessage.textContent = '書き出す登録者がいません。';
    return;
  }

  const toCsvCell = (value) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const rows = [
    ['メールアドレス', '登録日時'].map(toCsvCell).join(','),
    ...accounts.map((account) => [account.email, account.createdAt].map(toCsvCell).join(','))
  ];
  const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recipeta-registrants-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  registrantsMessage.textContent = `${accounts.length}件の登録者情報をCSVに書き出しました。`;
}

function openRegistrantsPage() {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    showAuthView('登録者情報の確認には開発者アカウントでログインしてください。');
    return;
  }

  hideSubpages();
  plannerView.hidden = true;
  registrantsPage.hidden = false;
  registrantsMessage.textContent = '';
  renderRegistrants();
}

function closeRegistrantsPage() {
  registrantsPage.hidden = true;
  vocAdminPage.hidden = false;
  plannerView.hidden = true;
  window.vocManager?.loadAdmin();
}

function deleteRegistrant(id) {
  const user = getCurrentUser();
  if (!user || user.role !== 'developer') {
    registrantsMessage.textContent = '登録の削除には開発者権限が必要です。';
    return;
  }

  const accounts = getLocalRegistrants();
  const account = accounts.find((item) => item.id === id);
  if (!account) {
    registrantsMessage.textContent = '登録者が見つかりません。一覧を更新してください。';
    return;
  }
  if (!window.confirm(`${account.email} のローカル登録と、このブラウザに保存された利用データ・VOCを削除しますか？この操作は取り消せません。`)) {
    return;
  }

  try {
    const vocMessages = JSON.parse(localStorage.getItem('meal-planner-voc-messages') || '[]');
    if (!Array.isArray(vocMessages)) throw new Error('VOCデータの形式が正しくありません。');
    saveStoredAccounts(getStoredAccounts().filter((item) => item.id !== id));
    localStorage.setItem('meal-planner-voc-messages', JSON.stringify(vocMessages.filter((message) => message.userId !== id)));
    localStorage.removeItem(getUserDataKey(account.email));
    renderRegistrants();
    registrantsMessage.textContent = 'ローカル登録と、このブラウザに保存された利用データ・VOCを削除しました。';
  } catch (error) {
    console.error('登録者情報を削除できませんでした', error);
    registrantsMessage.textContent = '登録者情報を削除できませんでした。ブラウザの保存領域を確認してください。';
  }
}

function openAnnouncementsPage() {
  hideSubpages();
  plannerView.hidden = true;
  announcementsPage.hidden = false;
  window.announcementsManager?.loadMine();
  closeAnnouncementsButton.focus();
}

async function handleMypageSubmit(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    showAuthView('マイページを開くにはログインしてください。');
    return;
  }

  const nextEmail = mypageEmailInput.value.trim();
  const currentPassword = mypageCurrentPasswordInput.value.trim();
  const newPassword = mypageNewPasswordInput.value.trim();
  const passwordConfirm = mypageNewPasswordConfirmInput.value.trim();

  if (!nextEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    mypageMessage.textContent = '正しいメールアドレスを入力してください。';
    return;
  }

  if (!currentPassword) {
    mypageMessage.textContent = '現在のパスワードを入力してください。';
    return;
  }

  const accounts = getStoredAccounts();
  const accountIndex = accounts.findIndex((account) => account.id === user.id);
  const existingAccount = accountIndex >= 0 ? accounts[accountIndex] : null;

  if (!existingAccount || existingAccount.password !== currentPassword) {
    mypageMessage.textContent = '現在のパスワードが違います。';
    return;
  }

  if (newPassword && newPassword.length < 6) {
    mypageMessage.textContent = '新しいパスワードは6文字以上で入力してください。';
    return;
  }

  if (newPassword && newPassword !== passwordConfirm) {
    mypageMessage.textContent = '新しいパスワードが確認用と一致しません。';
    return;
  }

  const normalizedNextEmail = getSafeEmail(nextEmail);
  const duplicateAccount = accounts.find((account) => account.id !== user.id && getSafeEmail(account.email) === normalizedNextEmail);
  if (duplicateAccount) {
    mypageMessage.textContent = 'このメールアドレスは既に使用されています。';
    return;
  }

  const originalUserData = loadUserData();
  if (normalizedNextEmail !== getSafeEmail(user.email)) {
    localStorage.removeItem(getUserDataKey(user.email));
    localStorage.setItem(getUserDataKey(normalizedNextEmail), JSON.stringify(originalUserData));
  }

  const updatedAccount = {
    ...existingAccount,
    email: normalizedNextEmail,
    password: newPassword || existingAccount.password
  };
  accounts[accountIndex] = updatedAccount;
  saveStoredAccounts(accounts);

  const updatedUser = {
    id: updatedAccount.id,
    email: updatedAccount.email,
    createdAt: updatedAccount.createdAt,
    role: updatedAccount.role || 'user'
  };

  setCurrentUser(updatedUser);
  setStoredCurrentUser(updatedUser);
  syncCurrentUserBadge();
  renderMypageProfile();
  mypageMessage.textContent = 'アカウント情報を更新しました。';
}

function exportUserData() {
  const user = getCurrentUser();
  if (!user) {
    showAuthView('ログインしてください。');
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      email: user.email,
      createdAt: user.createdAt || null,
      role: user.role || 'user'
    },
    data: {
      bookmarks: getBookmarks(),
      history: getHistory(),
      shoppingChecks: getShoppingChecks(),
      healthScores: getHealthScores(),
      eatenLogs: getEatenLogs()
    }
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${getSafeEmail(user.email).replace(/[^a-z0-9._-]/g, '_')}-meal-data.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  mypageMessage.textContent = '保存データをダウンロードしました。';
}

function resetUserLocalData() {
  const user = getCurrentUser();
  if (!user) {
    showAuthView('ログインしてください。');
    return;
  }

  const confirmed = window.confirm('保存済みの献立・履歴・ブックマークを削除しますか？');
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(getUserDataKey(user.email));
  renderUserData();
  mypageMessage.textContent = '保存済みデータを削除しました。';
}

async function handleDeleteAccount() {
  const user = getCurrentUser();
  if (!user) {
    showAuthView('ログインしてください。');
    return;
  }

  const password = deleteAccountPasswordInput.value.trim();
  if (!password) {
    mypageMessage.textContent = '削除確認のため、現在のパスワードを入力してください。';
    return;
  }

  const accounts = getStoredAccounts();
  const accountIndex = accounts.findIndex((account) => account.id === user.id);
  if (accountIndex < 0 || accounts[accountIndex].password !== password) {
    mypageMessage.textContent = '現在のパスワードが違います。';
    return;
  }

  const confirmed = window.confirm('本当にアカウントを削除しますか？ 保存データと送信済みVOCもすべて削除されます。');
  if (!confirmed) {
    return;
  }

  accounts.splice(accountIndex, 1);
  saveStoredAccounts(accounts);

  localStorage.removeItem(getUserDataKey(user.email));
  clearStoredCurrentUser();
  clearCurrentUser();
  deleteAccountPasswordInput.value = '';
  authForm.reset();
  mypageForm.reset();
  setAuthMode('signin');
  showAuthView('アカウントを削除しました。もう一度登録してご利用ください。');
}

function togglePasswordVisibility(event) {
  const toggleButton = event.target.closest('[data-password-toggle]');
  if (!toggleButton) return;

  const inputId = toggleButton.dataset.passwordToggle;
  const input = document.getElementById(inputId);
  if (!input) return;

  const isVisible = input.type === 'text';
  setPasswordVisibility(inputId, !isVisible);
  toggleButton.textContent = isVisible ? '表示' : '非表示';
}

function handleDeveloperLogin() {
  authEmailInput.value = '';
  authPasswordInput.value = '';
  setAuthMode('developer');
  authPasswordInput.focus();
  if (!supabaseClient) authMessage.textContent = '開発者ログインはSupabase設定後に利用できます。';
}

function returnToUserLogin() {
  authEmailInput.value = '';
  authPasswordInput.value = '';
  setAuthMode('signin');
  authEmailInput.focus();
}


const bookmarksStorageKey = 'meal-planner-bookmarks';
const historyStorageKey = 'meal-planner-history';
const shoppingChecksStorageKey = 'meal-planner-shopping-checks';
const healthScoresStorageKey = 'meal-planner-health-scores';
const eatenLogsStorageKey = 'meal-planner-eaten-logs';

const mealLibrary = {
  和風: {
    breakfast: [
      { name: '焼き鮭とほうれん草のご飯', desc: 'たんぱく質と鉄分をしっかり', tags: ['たんぱく質', '鉄分'], steps: ['1. 鮭を焼いて、ほうれん草はさっと茹でます。', '2. ご飯にのせて、しょうゆを少しかけます。', '3. すぐ食べられるので朝にもぴったりです。'] },
      { name: '味噌汁と豆腐の朝食', desc: '温かくて食べやすい', tags: ['温かい', '満足感'], steps: ['1. 水に味噌を溶いて、豆腐とわかめを加えます。', '2. 5分ほど煮て、白いご飯と一緒に出します。', '3. 忙しい朝でも作りやすいメニューです。'] }
    ],
    lunch: [
      { name: '鶏むね肉の照り焼き定食', desc: 'ご飯と野菜がバランス良い', tags: ['主菜', '野菜'], steps: ['1. 鶏むね肉を焼いて、照り焼きソースをからめます。', '2. きゅうりやキャベツを添えます。', '3. ご飯と一緒に盛り付ければ完成です。'] },
      { name: '豚しゃぶ野菜丼', desc: 'さっぱり食べやすい', tags: ['ヘルシー', '野菜'], steps: ['1. 豚肉をゆでて、きゅうりや大根を添えます。', '2. ご飯の上にのせて、ポン酢をかけます。', '3. すぐ食べられるので献立作りがラクです。'] }
    ],
    dinner: [
      { name: '鮭ときのこのホイル焼き', desc: 'お手軽で香りも良い', tags: ['魚', '簡単'], steps: ['1. 鮭ときのこをアルミホイルにのせます。', '2. ふたをして、オーブンかフライパンで焼きます。', '3. お皿に出せば完成です。'] },
      { name: 'うどんと焼き茄子の献立', desc: 'ぬくもりのある一皿', tags: ['温かい', '満足感'], steps: ['1. 茄子を焼いて、うどんをゆでます。', '2. だしでつけて、茄子を乗せます。', '3. すぐ温まりやすい夜食に向いています。'] }
    ]
  },
  洋風: {
    breakfast: [
      { name: 'たまごとトマトのトースト', desc: '朝から軽く食べたい日向き', tags: ['朝食向き', 'たんぱく質'], steps: ['1. トーストを焼いて、たまごを目玉焼きにします。', '2. トマトを切ってのせます。', '3. 塩こしょうで味を整えます。'] },
      { name: 'ヨーグルトとフルーツのボウル', desc: 'すぐ準備できる', tags: ['軽い', '美容'], steps: ['1. ヨーグルトをボウルに入れます。', '2. バナナやベリーをのせます。', '3. はちみつを少しかければ完成です。'] }
    ],
    lunch: [
      { name: 'チキンと野菜のオーブン焼き', desc: '香りがよく食欲をそそる', tags: ['主菜', '野菜'], steps: ['1. 鶏肉と野菜をオーブン皿に入れます。', '2. オリーブオイルと塩こしょうで味付けします。', '3. 焼き色がつくまで焼けば完成です。'] },
      { name: 'パスタサラダ', desc: '冷やしてもおいしい', tags: ['冷製', 'ボリューム'], steps: ['1. パスタをゆでて冷まします。', '2. トマトやきゅうりを切って混ぜます。', '3. ドレッシングで和えれば完成です。'] }
    ],
    dinner: [
      { name: 'ハンバーグとポテト', desc: '家族が喜ぶ定番', tags: ['満足感', 'ご飯に合う'], steps: ['1. 合いびき肉をまとめてハンバーグにします。', '2. フライパンで焼いて、ポテトを一緒に揚げます。', '3. ソースをかければ完成です。'] },
      { name: 'チーズ入りオムレツとサラダ', desc: '手軽に作りやすい', tags: ['シンプル', 'たんぱく質'], steps: ['1. 卵を溶いて、チーズを加えます。', '2. フライパンで焼いて半分に折ります。', '3. サラダと一緒に出せば大丈夫です。'] }
    ]
  },
  さっぱり: {
    breakfast: [
      { name: '冷奴ときゅうりの朝食', desc: '暑い日はこれで軽く', tags: ['さっぱり', 'ヘルシー'], steps: ['1. 冷奴を切って皿に出します。', '2. きゅうりを薄く切って添えます。', '3. しょうゆを少しかけるだけです。'] },
      { name: '雑穀米と小鉢', desc: '食べやすくて続けやすい', tags: ['軽い', '食物繊維'], steps: ['1. 雑穀米を炊いておきます。', '2. 小鉢に切り干し大根やきゅうりを入れます。', '3. さっと味付けすれば完成です。'] }
    ],
    lunch: [
      { name: '鶏むね肉のサラダボウル', desc: '野菜をたくさん食べたい日向き', tags: ['野菜', '軽い'], steps: ['1. 鶏むね肉を炒めて冷まします。', '2. レタスやトマトをボウルに入れます。', '3. ドレッシングで和えます。'] },
      { name: '冷製うどん', desc: '夏にぴったり', tags: ['さっぱり', '常備食'], steps: ['1. うどんをゆでて冷やします。', '2. きゅうりやわさびをのせます。', '3. つゆをかけて食べます。'] }
    ],
    dinner: [
      { name: '豆腐ステーキと小松菜', desc: 'ヘルシーに仕上がる', tags: ['低カロリー', '野菜'], steps: ['1. 豆腐を焼いて、両面に焼き色をつけます。', '2. 小松菜をさっと茹でます。', '3. しょうゆで味付けします。'] },
      { name: 'お刺身と酢の物', desc: '少し贅沢な夜に', tags: ['さっぱり', 'おもてなし'], steps: ['1. お刺身を皿に並べます。', '2. 酢の物を作って添えます。', '3. お醤油とわさびで味わいます。'] }
    ]
  },
  ほっこり: {
    breakfast: [
      { name: '雑炊とおかか玉子', desc: '朝からほっとする', tags: ['温かい', '満足感'], steps: ['1. ご飯を鍋に入れて水を足します。', '2. 卵を落として、ねぎを散らします。', '3. おかかをかければ完成です。'] },
      { name: 'パンとシチュー', desc: 'ゆっくり朝にぴったり', tags: ['安心感', 'ボリューム'], steps: ['1. シチューを温めます。', '2. パンをトーストします。', '3. 皿に盛って食べます。'] }
    ],
    lunch: [
      { name: '親子丼', desc: '家族に人気の一皿', tags: ['定番', '満足感'], steps: ['1. 鶏肉を煮て、卵をまぜます。', '2. ご飯の上にかけます。', '3. ねぎをのせて完成です。'] },
      { name: 'カレーライス', desc: '作り置きにも便利', tags: ['家庭的', '温かい'], steps: ['1. 具材を炒めて、カレー粉を加えます。', '2. 水を入れてとろみをつけます。', '3. ご飯にかければ完成です。'] }
    ],
    dinner: [
      { name: '鍋料理', desc: 'みんなで囲める献立', tags: ['みんなで', '季節感'], steps: ['1. 鍋にだしを入れて、具材を並べます。', '2. 少しずつ煮込んで温めます。', '3. みんなで囲んで食べます。'] },
      { name: 'クリームシチューとご飯', desc: '疲れた日にも心安らぐ', tags: ['ほっこり', '温かい'], steps: ['1. 玉ねぎやジャガイモを炒めます。', '2. 牛乳とルーを加えて煮込みます。', '3. ご飯と一緒に盛り付けます。'] }
    ]
  },
  ガッツリ: {
    breakfast: [
      { name: '目玉焼きと焼き芋の朝食', desc: 'エネルギーが必要な日に', tags: ['満足感', '朝食向き'], steps: ['1. 焼き芋を温めます。', '2. 目玉焼きを作ります。', '3. 皿に並べれば完成です。'] },
      { name: 'トーストとハムエッグ', desc: 'ボリュームを出しやすい', tags: ['たんぱく質', '満足感'], steps: ['1. トーストを焼きます。', '2. ハムと卵を焼きます。', '3. そのまま組み合わせます。'] }
    ],
    lunch: [
      { name: 'チキンカレー', desc: 'しっかり食べたい日向き', tags: ['ガッツリ', '定番'], steps: ['1. 鶏肉と玉ねぎを炒めます。', '2. カレー粉と水を加えて煮ます。', '3. ご飯にかけて完成です。'] },
      { name: '麻婆豆腐定食', desc: '食べごたえがある', tags: ['ボリューム', '満足感'], steps: ['1. 豆腐とひき肉を炒めます。', '2. しょうゆと味噌で味を整えます。', '3. ご飯と一緒に出します。'] }
    ],
    dinner: [
      { name: '焼き肉風定食', desc: '家族全員が喜びやすい', tags: ['ガッツリ', 'お祭り気分'], steps: ['1. お肉を焼いて、野菜も一緒に焼きます。', '2. ご飯と味噌汁を用意します。', '3. そのまま盛り付ければOKです。'] },
      { name: 'グラタン', desc: 'やさしい味で満足感が高い', tags: ['温かい', 'ボリューム'], steps: ['1. マカロニとソースを合わせます。', '2. チーズをのせて焼きます。', '3. そのまま食べやすいです。'] }
    ]
  },
  時短: {
    breakfast: [
      { name: 'バナナヨーグルト', desc: '3分でできる', tags: ['時短', '簡単'], steps: ['1. ヨーグルトを器に入れます。', '2. バナナを切ってのせます。', '3. すぐ食べられます。'] },
      { name: 'おにぎりと卵焼き', desc: '冷凍や作り置きでラク', tags: ['時短', '朝食向き'], steps: ['1. おにぎりを用意します。', '2. 卵焼きを切ります。', '3. そのまま並べれば完成です。'] }
    ],
    lunch: [
      { name: '冷凍うどんと卵', desc: '10分でできる', tags: ['時短', '簡単'], steps: ['1. 冷凍うどんをゆでます。', '2. 卵を割り入れて混ぜます。', '3. しょうゆを少しかけます。'] },
      { name: 'トマトチーズトースト', desc: '忙しい日の定番', tags: ['時短', '軽い'], steps: ['1. パンを焼きます。', '2. トマトとチーズをのせます。', '3. オーブンで軽く焼けば完成です。'] }
    ],
    dinner: [
      { name: '焼き鮭とキャベツ', desc: '気軽に作れる', tags: ['時短', '主菜'], steps: ['1. 鮭を焼きます。', '2. キャベツを切って炒めます。', '3. お皿に並べれば完成です。'] },
      { name: '豚バラと玉ねぎの炒め物', desc: 'おかずが一品でOK', tags: ['時短', '満足感'], steps: ['1. 豚バラを焼きます。', '2. 玉ねぎを加えて炒めます。', '3. ご飯と一緒に出します。'] }
    ]
  },
  子ども向け: {
    breakfast: [
      { name: 'ふわふわ卵とトースト', desc: '子どもが食べやすい', tags: ['子ども向け', 'たんぱく質'], steps: ['1. 卵を焼いてふわっと仕上げます。', '2. トーストを用意します。', '3. そのまま組み合わせます。'] },
      { name: 'ミニオムライス', desc: '見た目も楽しい', tags: ['かわいい', 'ご飯'], steps: ['1. ご飯にケチャップを混ぜます。', '2. 卵を乗せて丸くまとめます。', '3. まわりに野菜を添えます。'] }
    ],
    lunch: [
      { name: 'チキンライス', desc: '好きな子が多い定番', tags: ['子ども向け', '満足感'], steps: ['1. 鶏肉を炒めて、米と一緒に煮ます。', '2. ケチャップで味を整えます。', '3. 皿に盛って完成です。'] },
      { name: 'うどんの卵とじ', desc: '温かいのが安心', tags: ['やさしい', '簡単'], steps: ['1. うどんをゆでます。', '2. 卵を絡めて少し煮ます。', '3. すぐ食べられます。'] }
    ],
    dinner: [
      { name: 'ハンバーグとコーン', desc: '子どもにも人気', tags: ['子ども向け', 'ご飯に合う'], steps: ['1. ハンバーグを焼きます。', '2. コーンを温めます。', '3. ご飯と一緒に盛り付けます。'] },
      { name: '野菜たっぷりスープパスタ', desc: '食べやすくて栄養も取れます', tags: ['野菜', 'やさしい'], steps: ['1. パスタをゆでます。', '2. 野菜を切ってスープに入れます。', '3. パスタと和えて完成です。'] }
    ]
  },
  節約: {
    breakfast: [
      { name: '卵とねぎのおにぎり', desc: '材料が少なくてOK', tags: ['節約', '朝食向き'], steps: ['1. ご飯に卵とねぎを混ぜます。', '2. 形を整えて焼きます。', '3. そのまま食べられます。'] },
      { name: '豆腐と大根の味噌汁', desc: 'お財布に優しい', tags: ['節約', '温かい'], steps: ['1. 大根を切って煮ます。', '2. 豆腐を加えます。', '3. 味噌で仕上げます。'] }
    ],
    lunch: [
      { name: 'ひじきと卵の炒飯', desc: '冷蔵庫の残り物でもOK', tags: ['節約', '簡単'], steps: ['1. ご飯を熱して炒めます。', '2. ひじきと卵を加えます。', '3. しょうゆで味を整えます。'] },
      { name: 'じゃがいもと玉ねぎの煮物', desc: '手間が少なくて続けやすい', tags: ['節約', '定番'], steps: ['1. じゃがいもと玉ねぎを切ります。', '2. 水と調味料で煮ます。', '3. しんなりしたら完成です。'] }
    ],
    dinner: [
      { name: '豆腐ハンバーグ', desc: 'お肉の代わりに使いやすい', tags: ['節約', '満足感'], steps: ['1. 豆腐をしぼって混ぜます。', '2. まとめて焼きます。', '3. ソースをかけて食べます。'] },
      { name: '野菜たっぷりスープ', desc: '材料を少しで作れる', tags: ['節約', 'ヘルシー'], steps: ['1. 野菜を切って鍋に入れます。', '2. 水とコンソメで煮ます。', '3. お好みでご飯を添えます。'] }
    ]
  }
};

function getAllMeals() {
  return Object.values(mealLibrary).flatMap((menu) => [
    ...menu.breakfast,
    ...menu.lunch,
    ...menu.dinner
  ]).filter((meal, index, meals) => meals.findIndex((item) => item.name === meal.name) === index);
}

function renderRecipeSearch() {
  const query = recipeSearchInput.value.trim().toLocaleLowerCase();
  const meals = getAllMeals();
  const results = meals.filter((meal) => {
    if (!query) return true;
    const searchableText = [
      meal.name,
      meal.desc,
      ...(meal.tags || []),
      ...getMealIngredients(meal),
      ...meal.steps
    ].join(' ').toLocaleLowerCase();
    return searchableText.includes(query);
  });
  const visibleResults = results.slice(0, 12);
  const people = document.getElementById('people').value;

  recipeSearchCount.textContent = query
    ? `${results.length}品${results.length > visibleResults.length ? '（上位12品を表示）' : ''}`
    : `${meals.length}品`;
  recipeSearchHint.textContent = query
    ? `「${recipeSearchInput.value.trim()}」の検索結果 · 材料は${people}人分の目安です。`
    : `材料の分量は、上の「人数」(${people}人)に合わせて表示されます。`;

  if (!visibleResults.length) {
    recipeSearchResults.innerHTML = '<p class="empty-message recipe-search-empty">レシピが見つかりません。別の料理名や食材で検索してください。</p>';
    return;
  }

  recipeSearchResults.innerHTML = visibleResults.map((meal) => `
    <article class="recipe-search-result">
      <div class="recipe-search-result-heading">
        <h3>${escapeHtml(meal.name)}</h3>
        <span class="duration-pill">⏱ 約${getMealTime(meal)}分</span>
      </div>
      <p class="recipe-search-description">${escapeHtml(meal.desc)}</p>
      <ul class="recipe-search-ingredients" aria-label="${escapeHtml(people)}人分の材料目安">
        ${formatMealIngredients(meal, people).map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join('')}
      </ul>
      <button type="button" class="load-bookmark-btn" data-search-meal="${encodeURIComponent(JSON.stringify(meal))}">作り方を見る</button>
    </article>
  `).join('');
}

const fridgeIngredientOptions = [
  '卵', '鶏肉', '豚肉', '鮭・魚', '豆腐', 'チーズ', 'ハム',
  'キャベツ', '玉ねぎ', 'じゃがいも', 'にんじん', 'トマト', 'きゅうり',
  '小松菜・ほうれん草', 'きのこ', 'ご飯', 'パン', 'うどん', 'パスタ'
];

function renderFridgeIngredients() {
  fridgeIngredients.innerHTML = fridgeIngredientOptions.map((ingredient) => `
    <button type="button" class="fridge-ingredient" data-fridge-ingredient="${ingredient}" aria-pressed="false">
      ${ingredient}
    </button>
  `).join('');
}

function getSelectedFridgeIngredients() {
  const selected = [...fridgeIngredients.querySelectorAll('[aria-pressed="true"]')]
    .map((button) => button.dataset.fridgeIngredient);
  const custom = [...fridgeOtherList.querySelectorAll('[data-custom-fridge-ingredient]')]
    .map((chip) => chip.dataset.customFridgeIngredient);
  return [...new Set([...selected, ...custom])];
}

function addCustomFridgeIngredients() {
  const values = fridgeOtherInput.value
    .split(/[、,，\s]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  values.forEach((value) => {
    const exists = [...fridgeOtherList.querySelectorAll('[data-custom-fridge-ingredient]')]
      .some((chip) => chip.dataset.customFridgeIngredient === value);
    if (exists) return;

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'fridge-custom-chip';
    chip.dataset.customFridgeIngredient = value;
    chip.textContent = `${value} ×`;
    chip.title = `${value}を削除`;
    fridgeOtherList.appendChild(chip);
  });

  fridgeOtherInput.value = '';
}

function ingredientMatches(ingredient, selectedIngredient) {
  if (ingredient.includes(selectedIngredient) || selectedIngredient.includes(ingredient)) return true;
  if (selectedIngredient === '鮭・魚' && /鮭|魚|刺身/.test(ingredient)) return true;
  if (selectedIngredient === '鶏肉' && /鶏/.test(ingredient)) return true;
  if (selectedIngredient === '豚肉' && /豚/.test(ingredient)) return true;
  if (selectedIngredient === 'きのこ' && ingredient.includes('きのこ')) return true;
  if (selectedIngredient === '小松菜・ほうれん草' && /小松菜|ほうれん草/.test(ingredient)) return true;
  return false;
}

function renderFridgeResults() {
  const selected = getSelectedFridgeIngredients();
  if (!selected.length) {
    fridgeResults.innerHTML = '<p class="empty-message">食材を1つ以上選んでください。</p>';
    return;
  }

  const people = document.getElementById('people').value;
  const results = getAllMeals().map((meal) => {
    const ingredients = getMealIngredients(meal);
    const matched = selected.filter((item) => ingredients.some((ingredient) => ingredientMatches(ingredient, item))).length;
    return { meal, matched };
  }).filter((result) => result.matched > 0).sort((a, b) => b.matched - a.matched).slice(0, 12);

  if (!results.length) {
    results.push({
      meal: {
        name: '冷蔵庫おまかせ食卓',
        desc: `${selected.join('・')}を中心に、フライパンで作れる一皿を考えました。`,
        tags: ['冷蔵庫レスキュー', 'おまかせ'],
        ingredients: [...selected, '油または調味料'],
        steps: [
          `1. ${selected.join('、')}を食べやすい大きさに切ります。`,
          '2. 火の通りにくい食材から順に炒め、塩こしょうやしょうゆで味を整えます。',
          '3. ご飯やパンを添えて、今日の食卓に並べます。'
        ]
      },
      matched: selected.length
    });
  }

  fridgeResults.innerHTML = `
    <div class="fridge-results-heading">
      <h3>作れそうな献立</h3>
      <span>${results.length}件・${people}人分</span>
    </div>
    <div class="fridge-result-grid">
      ${results.map(({ meal, matched }) => `
        <article class="fridge-result-item">
          <span class="fridge-match">${escapeHtml(`${matched}/${selected.length}食材が一致`)}</span>
          <h3>${escapeHtml(meal.name)}</h3>
          <p>${escapeHtml(meal.desc)}</p>
          <ul class="fridge-result-ingredients" aria-label="${escapeHtml(people)}人分の材料目安">
            ${formatMealIngredients(meal, people).map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join('')}
          </ul>
          <button type="button" class="load-bookmark-btn" data-fridge-meal="${encodeURIComponent(JSON.stringify(meal))}">詳しく見る</button>
        </article>
      `).join('')}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function getMealNutrition(meal) {
  const tags = meal.tags || [];
  const name = meal.name;

  let calories = 480;
  let protein = 24;
  let fiber = 6;

  if (tags.includes('時短') || tags.includes('軽い')) {
    calories = 360;
    protein = 18;
    fiber = 4;
  }

  if (tags.includes('ガッツリ') || tags.includes('満足感') || name.includes('ハンバーグ') || name.includes('カレー') || name.includes('グラタン')) {
    calories = 720;
    protein = 35;
    fiber = 5;
  }

  if (name.includes('サラダ') || name.includes('冷奴') || name.includes('豆腐') || name.includes('小松菜') || name.includes('きゅうり')) {
    calories = 420;
    protein = 22;
    fiber = 9;
  }

  if (name.includes('シチュー') || name.includes('鍋')) {
    calories = 610;
    protein = 27;
    fiber = 5;
  }

  if (tags.includes('節約')) {
    calories = Math.max(320, calories - 40);
  }

  if (tags.includes('低カロリー')) {
    calories = 360;
    protein = 18;
    fiber = 8;
  }

  return { calories, protein, fiber };
}

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(monthKey) {
  const [, month] = monthKey.split('-');
  return `${Number(month)}月`;
}

function getHealthAssessment(plan, selectedIndex = 0) {
  const pattern = plan.patterns[selectedIndex] || plan.patterns[0];
  const meals = [pattern.breakfast, pattern.lunch, pattern.dinner];
  const balanceScores = {
    standard: 20,
    vegetable: 18,
    protein: 16,
    fiber: 15,
    iron: 14,
    calcium: 14,
    lowcarb: 12
  };
  const vegetableCount = meals.filter((meal) => meal.tags.includes('野菜') || /野菜|サラダ|小松菜|ほうれん草|きゅうり/.test(meal.name)).length;
  const proteinCount = meals.filter((meal) => meal.tags.includes('たんぱく質') || /鶏|豚|肉|魚|鮭|卵|豆腐|ハンバーグ/.test(meal.name)).length;
  const fiberCount = meals.filter((meal) => meal.tags.includes('食物繊維') || /野菜|きのこ|海藻|雑穀|ひじき|サラダ/.test(meal.name)).length;
  const balanceScore = balanceScores[plan.values.balance] || balanceScores.standard;
  const score = Math.min(100, Math.max(0, 35 + balanceScore + vegetableCount * 5 + proteinCount * 3 + fiberCount * 3));
  let comment = '今月はこの調子で、主食・主菜・副菜の組み合わせを続けましょう。';

  if (vegetableCount < 2) {
    comment = '来月は野菜の副菜をもう1品。色の違う野菜を2種類以上取り入れる日を増やしましょう。';
  } else if (proteinCount < 2) {
    comment = '来月は卵・魚・大豆製品などの主菜を、朝か昼にも少し取り入れてみましょう。';
  } else if (fiberCount < 1) {
    comment = '来月はきのこ・海藻・雑穀・根菜を1品足して、食物繊維を補いましょう。';
  }

  return { score, comment };
}

function getHealthLevel(score) {
  if (score >= 80) return 'とても良好';
  if (score >= 65) return '良好';
  if (score >= 50) return 'まずまず';
  return '見直しポイントあり';
}

function getHealthScores() {
  return getUserDataValue(healthScoresStorageKey, {});
}

function renderHealthTrend(scores) {
  const today = new Date();
  today.setDate(1);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today);
    date.setMonth(today.getMonth() - (5 - index));
    const key = getMonthKey(date);
    const score = scores[key]?.score;
    return {
      key,
      label: getMonthLabel(key),
      score: Number.isFinite(score) && score >= 0 && score <= 100 ? score : null
    };
  });
  const recordedMonths = months.filter((month) => month.score !== null);
  const chartLabel = recordedMonths.length
    ? `健康スコアの直近6か月の推移。${recordedMonths.map((month) => `${month.key.replace('-', '年')}月 ${month.score}点`).join('、')}`
    : '健康スコアの推移。まだ食卓の記録がありません。';
  const chartLeft = 38;
  const chartRight = 332;
  const chartTop = 18;
  const chartBottom = 112;
  const points = months.map((month, index) => ({
    ...month,
    x: chartLeft + (chartRight - chartLeft) * index / (months.length - 1),
    y: month.score === null ? null : chartBottom - month.score * (chartBottom - chartTop) / 100
  }));
  const gridlines = [0, 50, 100].map((score) => {
    const y = chartBottom - score * (chartBottom - chartTop) / 100;
    return `<line class="health-trend-gridline" x1="${chartLeft}" y1="${y}" x2="${chartRight}" y2="${y}" /><text class="health-trend-axis-label" x="3" y="${y + 3}">${score}</text>`;
  }).join('');
  const lines = points.slice(1).map((point, index) => {
    const previous = points[index];
    return previous.score === null || point.score === null
      ? ''
      : `<line class="health-trend-line" x1="${previous.x}" y1="${previous.y}" x2="${point.x}" y2="${point.y}" />`;
  }).join('');
  const markers = points.map((point) => point.score === null
    ? ''
    : `<g class="health-trend-point"><title>${point.key.replace('-', '年')}月: ${point.score}点</title><circle cx="${point.x}" cy="${point.y}" r="4.5" /><text class="health-trend-point-label" x="${point.x}" y="${point.y - 10}" text-anchor="middle">${point.score}</text></g>`).join('');
  const monthLabels = points.map((point) => (
    `<text class="health-trend-month-label" x="${point.x}" y="137" text-anchor="middle">${point.label}</text>`
  )).join('');
  const emptyMessage = recordedMonths.length
    ? ''
    : '<p class="health-trend-empty">食べた献立を記録すると、月ごとのスコアがここに表示されます。</p>';

  healthTrendChart.innerHTML = `
    <div class="health-trend-plot">
      <svg viewBox="0 0 350 150" role="img" aria-label="${chartLabel}" focusable="false">
        ${gridlines}
        ${lines}
        ${markers}
        ${monthLabels}
      </svg>
      ${emptyMessage}
    </div>
  `;
}

function getEatenLogs() {
  return getUserDataValue(eatenLogsStorageKey, []);
}

function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function rebuildHealthScores() {
  const scores = {};
  getEatenLogs().forEach((log) => {
    const monthKey = log.date.slice(0, 7);
    const assessment = getHealthAssessment(log.plan, log.selectedIndex || 0);
    const current = scores[monthKey] || { total: 0, count: 0, score: 0, comment: '' };
    current.total += assessment.score;
    current.count += 1;
    current.score = Math.round(current.total / current.count);
    current.comment = assessment.comment;
    scores[monthKey] = current;
  });
  setUserDataValue(healthScoresStorageKey, scores);
}

function renderHealthLogs() {
  const logs = getEatenLogs();
  clearHealthLogsButton.style.display = logs.length ? 'inline-flex' : 'none';
  if (!logs.length) {
    healthLogList.innerHTML = '<p class="empty-message">記録はまだありません</p>';
    return;
  }

  healthLogList.innerHTML = logs.map((log, index) => {
    const pattern = log.plan.patterns[log.selectedIndex || 0] || log.plan.patterns[0];
    const date = new Date(`${log.date}T00:00:00`).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <article class="health-log-item">
        <div class="health-log-main">
          <span class="history-date">${date}</span>
          <strong>${log.plan.values.mood}・${log.plan.values.people}人分</strong>
          <span>朝 ${pattern.breakfast.name} / 昼 ${pattern.lunch.name} / 夜 ${pattern.dinner.name}</span>
        </div>
        <button type="button" class="delete-bookmark-btn" data-delete-health-log-index="${index}">この記録を削除</button>
      </article>
    `;
  }).join('');
}

function renderHealthMaster() {
  const monthKey = getMonthKey();
  const scores = getHealthScores();
  const current = scores[monthKey];
  const monthLogs = getEatenLogs().filter((log) => log.date.startsWith(monthKey));
  const previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previous = scores[getMonthKey(previousDate)];
  const score = current ? current.score : null;

  healthMonth.textContent = getMonthLabel(monthKey);
  healthLogCount.textContent = `今月の食卓 ${monthLogs.length}回`;
  healthMeterFill.style.width = `${score || 0}%`;
  healthMeter.setAttribute('aria-valuenow', String(score || 0));
  healthScore.textContent = score === null ? '--' : score;
  healthLevel.textContent = score === null ? '今月の記録待ち' : getHealthLevel(score);
  healthDelta.textContent = score === null
    ? '献立を作ると計測を始めます'
    : previous ? `前月比 ${score - previous.score >= 0 ? '+' : ''}${score - previous.score}pt` : '今月から計測中';
  healthComment.textContent = current ? current.comment : '実際に食べた献立を記録すると、食事バランスをもとに健康レベルを表示します。';
  renderHealthTrend(scores);
  const alreadyRecorded = monthLogs.some((log) => log.date === getLocalDateKey());
  recordHealthButton.disabled = !resultPanel.currentPlan || alreadyRecorded;
  recordHealthButton.textContent = alreadyRecorded ? '本日は記録済み' : '食べた献立を記録';
}

function recordHealthScore(plan) {
  const monthKey = getMonthKey();
  const scores = getHealthScores();
  const assessment = getHealthAssessment(plan);
  const current = scores[monthKey] || { total: 0, count: 0, score: 0, comment: '' };
  current.total += assessment.score;
  current.count += 1;
  current.score = Math.round(current.total / current.count);
  current.comment = assessment.comment;
  scores[monthKey] = current;
  setUserDataValue(healthScoresStorageKey, scores);
  renderHealthMaster();
}

function recordEatenPlan(plan, selectedIndex = 0) {
  const today = getLocalDateKey();
  const logs = getEatenLogs();
  if (logs.some((log) => log.date === today)) return false;

  logs.unshift({ date: today, plan, selectedIndex });
  setUserDataValue(eatenLogsStorageKey, logs.slice(0, 180));
  rebuildHealthScores();
  renderHealthMaster();
  return true;
}

function getMealIngredients(meal) {
  if (meal.ingredients) return meal.ingredients;
  const name = meal.name;
  const ingredientRules = [
    ['焼き鮭とほうれん草のご飯', ['鮭の切り身', 'ほうれん草', 'ご飯', 'しょうゆ']],
    ['味噌汁と豆腐の朝食', ['豆腐', 'わかめ', '味噌', 'だし', 'ご飯']],
    ['鶏むね肉の照り焼き定食', ['鶏むね肉', 'しょうゆ', 'みりん', '砂糖', 'キャベツ・きゅうり', 'ご飯']],
    ['豚しゃぶ野菜丼', ['豚薄切り肉', 'きゅうり', '大根', 'ご飯', 'ポン酢']],
    ['鮭ときのこのホイル焼き', ['鮭の切り身', 'きのこ類', '玉ねぎ', 'バター', '塩・こしょう']],
    ['うどんと焼き茄子の献立', ['うどん', '茄子', 'だしつゆ', 'ねぎ', 'しょうが']],
    ['たまごとトマトのトースト', ['食パン', '卵', 'トマト', '塩・こしょう']],
    ['ヨーグルトとフルーツのボウル', ['ヨーグルト', 'バナナ・ベリー', 'はちみつ']],
    ['チキンと野菜のオーブン焼き', ['鶏肉', 'じゃがいも', 'にんじん', 'ブロッコリー', 'オリーブオイル', '塩・こしょう']],
    ['パスタサラダ', ['パスタ', 'トマト', 'きゅうり', 'ツナ', 'ドレッシング']],
    ['ハンバーグとポテト', ['合いびき肉', '玉ねぎ', '卵', 'パン粉', 'じゃがいも', 'ソース']],
    ['チーズ入りオムレツとサラダ', ['卵', 'チーズ', 'レタス・トマト', '塩・こしょう', 'ドレッシング']],
    ['冷奴ときゅうりの朝食', ['豆腐', 'きゅうり', 'しょうゆ', 'かつお節']],
    ['雑穀米と小鉢', ['雑穀米', '切り干し大根', 'きゅうり', 'しょうゆ']],
    ['鶏むね肉のサラダボウル', ['鶏むね肉', 'レタス', 'トマト', 'ゆで卵', 'ドレッシング']],
    ['冷製うどん', ['うどん', 'きゅうり', 'ねぎ', 'わさび', 'めんつゆ']],
    ['豆腐ステーキと小松菜', ['木綿豆腐', '小松菜', '片栗粉', 'しょうゆ', 'ごま油']],
    ['お刺身と酢の物', ['刺身', 'わかめ', 'きゅうり', '酢', 'しょうゆ・わさび']],
    ['雑炊とおかか玉子', ['ご飯', '卵', 'ねぎ', 'だし', 'かつお節']],
    ['パンとシチュー', ['食パン', '鶏肉', '玉ねぎ', 'じゃがいも', 'にんじん', 'シチューのルー']],
    ['親子丼', ['鶏もも肉', '卵', '玉ねぎ', 'だし・しょうゆ', 'ご飯', 'ねぎ']],
    ['カレーライス', ['豚肉または鶏肉', '玉ねぎ', 'じゃがいも', 'にんじん', 'カレールー', 'ご飯']],
    ['鍋料理', ['白菜', '長ねぎ', 'きのこ類', '豆腐', '豚肉または鶏肉', '鍋つゆ']],
    ['クリームシチューとご飯', ['鶏肉', '玉ねぎ', 'じゃがいも', 'にんじん', '牛乳', 'シチューのルー', 'ご飯']],
    ['目玉焼きと焼き芋の朝食', ['卵', '焼き芋', '塩・こしょう']],
    ['トーストとハムエッグ', ['食パン', '卵', 'ハム', 'バター', '塩・こしょう']],
    ['チキンカレー', ['鶏肉', '玉ねぎ', 'にんじん', 'カレールー', 'ご飯']],
    ['麻婆豆腐定食', ['豆腐', '豚ひき肉', '長ねぎ', '味噌・しょうゆ', '豆板醤', 'ご飯']],
    ['焼き肉風定食', ['牛肉または豚肉', '玉ねぎ・ピーマン', '焼き肉のたれ', 'ご飯', '味噌汁']],
    ['グラタン', ['マカロニ', '鶏肉', '玉ねぎ', '牛乳', '小麦粉', 'チーズ']],
    ['バナナヨーグルト', ['ヨーグルト', 'バナナ', 'はちみつ']],
    ['おにぎりと卵焼き', ['ご飯', '卵', 'のり', '塩']],
    ['冷凍うどんと卵', ['冷凍うどん', '卵', 'ねぎ', 'しょうゆ']],
    ['トマトチーズトースト', ['食パン', 'トマト', 'チーズ', '塩・こしょう']],
    ['焼き鮭とキャベツ', ['鮭の切り身', 'キャベツ', '油', '塩・こしょう']],
    ['豚バラと玉ねぎの炒め物', ['豚バラ肉', '玉ねぎ', 'しょうゆ', 'みりん', 'ご飯']],
    ['ふわふわ卵とトースト', ['卵', '食パン', '牛乳', 'バター', '塩']],
    ['ミニオムライス', ['ご飯', '卵', '鶏肉', '玉ねぎ', 'ケチャップ']],
    ['チキンライス', ['鶏肉', 'ご飯', '玉ねぎ', 'ケチャップ']],
    ['うどんの卵とじ', ['うどん', '卵', 'ねぎ', 'だしつゆ']],
    ['ハンバーグとコーン', ['合いびき肉', '玉ねぎ', '卵', 'パン粉', 'コーン', 'ソース']],
    ['野菜たっぷりスープパスタ', ['パスタ', 'キャベツ', 'にんじん', '玉ねぎ', 'ベーコン', 'コンソメ']],
    ['卵とねぎのおにぎり', ['ご飯', '卵', 'ねぎ', 'しょうゆ', '油']],
    ['豆腐と大根の味噌汁', ['豆腐', '大根', 'ねぎ', '味噌', 'だし']],
    ['ひじきと卵の炒飯', ['ご飯', 'ひじき', '卵', 'ねぎ', 'しょうゆ']],
    ['じゃがいもと玉ねぎの煮物', ['じゃがいも', '玉ねぎ', 'だし', 'しょうゆ', 'みりん']],
    ['豆腐ハンバーグ', ['木綿豆腐', '合いびき肉', '玉ねぎ', '卵', 'パン粉', 'ソース']],
    ['野菜たっぷりスープ', ['キャベツ', 'にんじん', '玉ねぎ', 'きのこ類', 'コンソメ', 'ご飯（お好みで）']]
  ];

  const matched = ingredientRules.find(([mealName]) => mealName === name);
  return matched ? matched[1] : ['主菜の食材', '野菜を2〜3種類', '調味料', 'ご飯またはパン'];
}

function getIngredientMeasure(ingredient) {
  if (/ご飯またはパン/.test(ingredient)) return { amount: 2, unit: '人分' };
  if (/ご飯|雑穀米/.test(ingredient)) return { amount: 300, unit: 'g' };
  if (/卵/.test(ingredient)) return { amount: 2, unit: '個' };
  if (/鮭の切り身/.test(ingredient)) return { amount: 2, unit: '切れ' };
  if (/刺身/.test(ingredient)) return { amount: 200, unit: 'g' };
  if (/鶏|豚|牛|ひき肉|合いびき肉|肉/.test(ingredient)) return { amount: 200, unit: 'g' };
  if (/豆腐/.test(ingredient)) return { amount: 300, unit: 'g' };
  if (/食パン/.test(ingredient)) return { amount: 2, unit: '枚' };
  if (/うどん/.test(ingredient)) return { amount: 2, unit: '玉' };
  if (/パスタ|マカロニ/.test(ingredient)) return { amount: 160, unit: 'g' };
  if (/ヨーグルト/.test(ingredient)) return { amount: 200, unit: 'g' };
  if (/バナナ/.test(ingredient)) return { amount: 2, unit: '本' };
  if (/ベリー/.test(ingredient)) return { amount: 50, unit: 'g' };
  if (/牛乳/.test(ingredient)) return { amount: 200, unit: 'ml' };
  if (/チーズ/.test(ingredient)) return { amount: 40, unit: 'g' };
  if (/パン粉|小麦粉|片栗粉/.test(ingredient)) return { amount: 2, unit: '大さじ' };
  if (/カレールー|シチューのルー/.test(ingredient)) return { amount: 2, unit: '皿分' };
  if (/コンソメ/.test(ingredient)) return { amount: 1, unit: '個' };
  if (/ベーコン|ハム/.test(ingredient)) return { amount: 2, unit: '枚' };
  if (/ツナ/.test(ingredient)) return { amount: 1, unit: '缶' };
  if (/ドレッシング|ポン酢|焼き肉のたれ|ケチャップ|はちみつ/.test(ingredient)) return { amount: 2, unit: '大さじ' };
  if (/ソース/.test(ingredient)) return { amount: 2, unit: '大さじ' };
  if (/しょうゆ|醤油|みりん|酢|オリーブオイル|ごま油|バター|油/.test(ingredient)) return { amount: 1, unit: '大さじ' };
  if (/味噌/.test(ingredient)) return { amount: 2, unit: '大さじ' };
  if (/砂糖|豆板醤|わさび|塩|こしょう/.test(ingredient)) return { amount: 1, unit: '小さじ' };
  if (/だしつゆ|めんつゆ|鍋つゆ|だし/.test(ingredient)) return { amount: 300, unit: 'ml' };
  if (/主菜の食材/.test(ingredient)) return { amount: 200, unit: 'g' };
  if (/野菜を2〜3種類/.test(ingredient)) return { amount: 200, unit: 'g' };
  if (/調味料/.test(ingredient)) return { amount: 1, unit: '大さじ' };
  if (/玉ねぎ/.test(ingredient)) return { amount: 1, unit: '個' };
  if (/じゃがいも/.test(ingredient)) return { amount: 2, unit: '個' };
  if (/にんじん/.test(ingredient)) return { amount: 1, unit: '本' };
  if (/きゅうり/.test(ingredient)) return { amount: 1, unit: '本' };
  if (/しょうが/.test(ingredient)) return { amount: 1, unit: '片' };
  if (/ねぎ/.test(ingredient)) return { amount: 1, unit: '本' };
  if (/トマト/.test(ingredient)) return { amount: 1, unit: '個' };
  if (/焼き芋/.test(ingredient)) return { amount: 2, unit: '本' };
  if (/キャベツ|レタス|ほうれん草|小松菜|白菜|きのこ|ブロッコリー|大根|茄子|ピーマン|コーン|ひじき|わかめ|切り干し大根/.test(ingredient)) {
    return { amount: 100, unit: 'g' };
  }
  if (/のり/.test(ingredient)) return { amount: 2, unit: '枚' };
  if (/かつお節/.test(ingredient)) return { amount: 1, unit: '袋' };
  return { amount: 1, unit: '適量' };
}

function formatMealIngredients(meal, people) {
  const servingCount = Math.max(1, Number(people) || 1);
  return getMealIngredients(meal).flatMap((item) => item.split('・').map((ingredient) => {
    const { amount, unit } = getIngredientMeasure(ingredient);
    const scaledAmount = amount * servingCount / 2;
    if (unit === '適量') return `${ingredient}：適量`;
    const formattedAmount = Number.isInteger(scaledAmount) ? scaledAmount : Number(scaledAmount.toFixed(1));
    const measure = unit === '大さじ' || unit === '小さじ' ? `${unit}${formattedAmount}` : `${formattedAmount}${unit}`;
    return `${ingredient}：${measure}`;
  }));
}

const balanceHints = {
  standard: {
    heading: 'バランス重視の献立です。',
    bullet: ['主菜・副菜・汁物の3点を意識しました。', '野菜とたんぱく質がしっかり入るようにしました。'],
    tip: '毎日の食事に取り入れやすい基本パターンです。'
  },
  protein: {
    heading: 'たんぱく質を意識した献立です。',
    bullet: ['魚・卵・肉を中心に組みました。', '満腹感が出やすいメニューです。'],
    tip: '体力をつけたい日や、家族の食べ応えを重視したい日に向いています。'
  },
  vegetable: {
    heading: '野菜を多めにした献立です。',
    bullet: ['副菜を増やして彩りを整えました。', '食物繊維を取りやすい組み合わせです。'],
    tip: '食べやすくて、さっぱりしたい日におすすめです。'
  },
  iron: {
    heading: '鉄分を意識した献立です。',
    bullet: ['小魚・レバー・ほうれん草などを取り入れやすくしました。', 'ビタミンCと一緒に食べると吸収しやすい組み合わせです。'],
    tip: '疲れやすい日や、栄養をしっかり取りたい日にぴったりです。'
  },
  fiber: {
    heading: '食物繊維をしっかり摂る献立です。',
    bullet: ['根菜・きのこ・海藻を中心に組みました。', 'お通じのサポートにもなりやすい内容です。'],
    tip: '腸内環境を整えたい日や、食べるものを軽くしたい日におすすめです。'
  },
  calcium: {
    heading: 'カルシウムを意識した献立です。',
    bullet: ['豆腐・小魚・牛乳の食材を使いやすくしました。', '骨づくりや体の土台を意識した内容です。'],
    tip: '成長期のお子さんや、日頃の栄養補助として使いやすいです。'
  },
  lowcarb: {
    heading: '低糖質寄りの献立です。',
    bullet: ['ご飯量を控えめにしやすい組み合わせです。', '野菜やたんぱく質を中心にしています。'],
    tip: '少し軽めに食べたい日や、置き換えとして使いやすいです。'
  }
};

function pickMeal(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildPatterns(moodMenu, count = 3) {
  const breakfastPool = [...moodMenu.breakfast];
  const lunchPool = [...moodMenu.lunch];
  const dinnerPool = [...moodMenu.dinner];
  const patterns = [];

  for (let index = 0; index < count; index += 1) {
    const breakfast = breakfastPool.splice(Math.floor(Math.random() * breakfastPool.length), 1)[0] || moodMenu.breakfast[0];
    const lunch = lunchPool.splice(Math.floor(Math.random() * lunchPool.length), 1)[0] || moodMenu.lunch[0];
    const dinner = dinnerPool.splice(Math.floor(Math.random() * dinnerPool.length), 1)[0] || moodMenu.dinner[0];
    patterns.push({ breakfast, lunch, dinner });
  }

  return patterns;
}

function buildGuide(meal, people) {
  const nutrition = getMealNutrition(meal);
  const ingredients = formatMealIngredients(meal, people);

  return `
    <div class="guide-card">
      <div class="section-label">必要な材料（${people}人分の目安）</div>
      <ul class="ingredient-list">
        ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
      </ul>
      <div class="nutrition-list">
        <span class="nutrition-pill">🔥 ${nutrition.calories} kcal</span>
        <span class="nutrition-pill">💪 たんぱく質 ${nutrition.protein}g</span>
        <span class="nutrition-pill">🌿 食物繊維 ${nutrition.fiber}g</span>
      </div>
      <div class="section-label">作り方</div>
      <ol class="timeline">
        ${meal.steps.map((step, index) => `
          <li class="recipe-step">
            <span class="step-number">${index + 1}</span>
            <span class="step-text">${step.replace(/^\d+\.\s*/, '')}</span>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

function getMealTime(meal) {
  const name = meal.name;
  const tags = meal.tags || [];
  let minutes = 30;

  if (tags.includes('時短') || name.includes('ヨーグルト') || name.includes('冷奴')) {
    minutes = 10;
  } else if (name.includes('鍋') || name.includes('シチュー') || name.includes('カレー')) {
    minutes = 40;
  } else if (tags.includes('簡単') || tags.includes('軽い')) {
    minutes = 20;
  }

  return minutes;
}

function getMealTips(meal) {
  const name = meal.name;
  const tips = ['材料は作る前にすべて計量し、調理の流れを確認しておくとスムーズです。'];

  if (name.includes('肉') || name.includes('鶏') || name.includes('豚') || name.includes('ハンバーグ')) {
    tips.push('肉の中心まで火が通ったことを確認してから盛り付けます。');
  }
  if (name.includes('鮭') || name.includes('刺身') || name.includes('魚')) {
    tips.push('魚は水気をキッチンペーパーで拭くと、焼くときに油がはねにくくなります。');
  }
  if (name.includes('卵') || name.includes('オムレツ') || name.includes('親子丼')) {
    tips.push('卵料理は余熱でも火が進むので、少し早めに火を止めるとふんわり仕上がります。');
  }
  if (name.includes('鍋') || name.includes('シチュー') || name.includes('スープ')) {
    tips.push('煮込み中は底が焦げないよう、ときどき鍋底からやさしく混ぜます。');
  }
  if (name.includes('トースト') || name.includes('パン')) {
    tips.push('パンは焼きすぎると具材が乾くため、焼き色を見ながら加熱します。');
  }

  return tips;
}

function getStepDetail(meal, index) {
  const name = meal.name;

  if (name.includes('うどん')) {
    if (index === 0) return '沸騰した鍋で表示時間を目安に5〜7分ゆでます。冷製なら流水でしっかり冷やします。';
    return '具材を加えたら1〜2分温め、麺がのびる前に盛り付けます。';
  }
  if (name.includes('鍋料理')) {
    if (index === 0) return '鍋つゆを沸かしてから、火が通りにくい具材を先に入れます。';
    return '沸騰後は中火で8〜10分、肉の中心まで火が通るまで煮ます。';
  }
  if (name.includes('シチュー') || name.includes('カレー')) {
    if (index === 0) return '具材を油で3〜5分炒め、表面の色が変わるまで加熱します。';
    return '沸騰したら弱火にして15〜20分煮込み、具材が柔らかくなったら仕上げます。';
  }
  if (name.includes('鮭') || name.includes('魚')) {
    return index === 0 ? '魚の水気を拭き、片面を中火で4〜5分焼きます。' : '裏返してさらに3〜4分、身の中心まで火が通るように焼きます。';
  }
  if (name.includes('肉') || name.includes('鶏') || name.includes('豚') || name.includes('ハンバーグ')) {
    return index === 0 ? '肉を焼く前に表面の水気を拭き、片面を中火で3〜4分焼きます。' : '裏返して弱めの中火で4〜6分、中心まで火が通るまで加熱します。';
  }
  if (name.includes('ほうれん草') || name.includes('小松菜') || name.includes('野菜')) {
    return index === 0 ? '鍋で1〜2分さっとゆで、色が鮮やかになったら取り出します。' : '水気をしっかり絞ってから、他の具材と合わせます。';
  }
  if (name.includes('卵') || name.includes('オムレツ') || name.includes('親子丼')) {
    return index === 0 ? '卵を溶き、白身を切るように混ぜておきます。' : '弱火で1〜2分、表面が半熟のうちに火を止めて余熱で仕上げます。';
  }

  return index === 0
    ? '材料を食べやすい大きさに切り、調味料を先に準備します。'
    : '全体に火が通り、香りが立ったら味を確認して仕上げます。';
}

function renderMealDetail(meal, mealLabel, people) {
  const nutrition = getMealNutrition(meal);
  mealDetailContent.innerHTML = `
    <div class="meal-detail-heading">
      <p class="meta">${mealLabel}の献立</p>
      <h2>${meal.name}</h2>
      <p class="meal-detail-description">${meal.desc}</p>
      <div class="meal-detail-meta">
        <span class="duration-pill">⏱ 約${getMealTime(meal)}分</span>
        <span class="duration-pill">${people}人分</span>
      </div>
    </div>
    <div class="meal-detail-grid">
      <section class="detail-section">
        <h3>必要な材料</h3>
        <p class="detail-note">${people}人分の目安です。分量は材料や好みに合わせて調整してください。</p>
        <ul class="detail-ingredients">
          ${formatMealIngredients(meal, people).map((ingredient) => `<li>${ingredient}</li>`).join('')}
        </ul>
      </section>
      <section class="detail-section detail-nutrition">
        <h3>栄養の目安</h3>
        <div class="nutrition-list">
          <span class="nutrition-pill">🔥 ${nutrition.calories} kcal</span>
          <span class="nutrition-pill">💪 ${nutrition.protein}g</span>
          <span class="nutrition-pill">🌿 ${nutrition.fiber}g</span>
        </div>
      </section>
    </div>
    <section class="detail-section detail-steps">
      <h3>詳しい作り方</h3>
      <ol class="detail-step-list">
        ${meal.steps.map((step, index) => `
          <li>
            <span class="detail-step-number">${index + 1}</span>
            <div><strong>${step.replace(/^\d+\.\s*/, '')}</strong><p>${getStepDetail(meal, index)}</p></div>
          </li>
        `).join('')}
      </ol>
    </section>
    <section class="detail-section caution-section">
      <h3>作るときの注意点</h3>
      <ul class="caution-list">
        ${getMealTips(meal).map((tip) => `<li>${tip}</li>`).join('')}
      </ul>
    </section>
  `;
}

function getPlanKey(plan) {
  return JSON.stringify(plan.patterns);
}

function createPlan(values) {
  const mood = values.mood;
  const balance = values.balance;
  const people = Number(values.people);
  const budget = values.budget;
  const moodMenu = mealLibrary[mood] || mealLibrary.和風;
  const patterns = buildPatterns(moodMenu, 3);
  return { values, patterns };
}

function buildResult(plan, selectedIndex = 0) {
  const { values, patterns } = plan;
  const mood = values.mood;
  const balance = values.balance;
  const people = Number(values.people);
  const budget = values.budget;
  const primaryPattern = patterns[selectedIndex] || patterns[0];

  const shoppingList = [
    primaryPattern.breakfast.name.includes('鮭') || primaryPattern.breakfast.name.includes('鶏') || primaryPattern.breakfast.name.includes('肉') || primaryPattern.lunch.name.includes('鶏') || primaryPattern.dinner.name.includes('魚') ? '主菜の食材' : 'お肉またはお魚',
    '野菜を2〜3種類',
    budget === 'cozy' ? 'お好みの副菜を1品' : '汁物またはサラダ'
  ];

  const summary = balanceHints[balance] || balanceHints.standard;

  return `
    <div class="result-grid">
      <div class="result-actions">
        <button type="button" class="bookmark-btn" data-bookmark-plan="${encodeURIComponent(JSON.stringify(plan))}">☆ この献立をブックマーク</button>
        <button type="button" class="health-record-btn" data-record-eaten>食べた献立を記録</button>
      </div>
      <div class="pattern-summary-card">
        <h3>3つの献立候補</h3>
        <ul class="pattern-list">
          ${patterns.map((pattern, index) => `
            <li class="${index === selectedIndex ? 'is-selected' : ''}">
              <button type="button" class="candidate-button" data-candidate-index="${index}" aria-pressed="${index === selectedIndex}">
                <strong>候補 ${index + 1}</strong>
              <span>朝: ${pattern.breakfast.name}</span>
              <span>昼: ${pattern.lunch.name}</span>
              <span>夜: ${pattern.dinner.name}</span>
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="meal-card" data-meal-slot="breakfast" tabindex="0" role="button" aria-label="${primaryPattern.breakfast.name}の詳しい作り方を開く">
        <div class="meal-heading">
          <p class="meta">朝</p>
          <span class="duration-pill">⏱ 約${getMealTime(primaryPattern.breakfast)}分</span>
        </div>
        <h3>${primaryPattern.breakfast.name}</h3>
        <p>${primaryPattern.breakfast.desc}</p>
        ${buildGuide(primaryPattern.breakfast, people)}
        <div class="badges">
          ${primaryPattern.breakfast.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
        <p class="meal-detail-link">詳しい作り方と注意点を見る →</p>
      </div>
      <div class="meal-card" data-meal-slot="lunch" tabindex="0" role="button" aria-label="${primaryPattern.lunch.name}の詳しい作り方を開く">
        <div class="meal-heading">
          <p class="meta">昼</p>
          <span class="duration-pill">⏱ 約${getMealTime(primaryPattern.lunch)}分</span>
        </div>
        <h3>${primaryPattern.lunch.name}</h3>
        <p>${primaryPattern.lunch.desc}</p>
        ${buildGuide(primaryPattern.lunch, people)}
        <div class="badges">
          ${primaryPattern.lunch.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
        <p class="meal-detail-link">詳しい作り方と注意点を見る →</p>
      </div>
      <div class="meal-card" data-meal-slot="dinner" tabindex="0" role="button" aria-label="${primaryPattern.dinner.name}の詳しい作り方を開く">
        <div class="meal-heading">
          <p class="meta">夜</p>
          <span class="duration-pill">⏱ 約${getMealTime(primaryPattern.dinner)}分</span>
        </div>
        <h3>${primaryPattern.dinner.name}</h3>
        <p>${primaryPattern.dinner.desc}</p>
        ${buildGuide(primaryPattern.dinner, people)}
        <div class="badges">
          ${primaryPattern.dinner.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
        <p class="meal-detail-link">詳しい作り方と注意点を見る →</p>
      </div>
      <div class="summary">
        <h3>${summary.heading}</h3>
        <ul>
          <li>人数: ${people}人分</li>
          <li>予算目安: ${budget === 'budget' ? 'お手頃' : budget === 'normal' ? '標準' : 'ちょっと贅沢'}</li>
          <li>ポイント: ${summary.tip}</li>
          ${summary.bullet.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <p><strong>買い物メモ:</strong> ${shoppingList.join(' / ')}</p>
      </div>
    </div>
  `;
}

function renderPlan(plan, selectedIndex = 0) {
  resultPanel.currentPlan = plan;
  resultPanel.currentPlanIndex = selectedIndex;
  resultPanel.innerHTML = buildResult(plan, selectedIndex);
  renderHealthMaster();
}

function getHistory() {
  return getUserDataValue(historyStorageKey, []);
}

function saveHistory(plan) {
  const history = getHistory().filter((item) => getPlanKey(item) !== getPlanKey(plan));
  history.unshift({ ...plan, createdAt: new Date().toISOString() });
  setUserDataValue(historyStorageKey, history.slice(0, 10));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  historyCount.textContent = history.length;
  clearHistoryButton.style.display = history.length ? 'inline-flex' : 'none';

  if (!history.length) {
    historyList.innerHTML = '<p class="empty-message">履歴はまだありません</p>';
    return;
  }

  historyList.innerHTML = history.map((plan, index) => {
    const pattern = plan.patterns[0];
    const date = new Date(plan.createdAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    return `
      <article class="history-item">
        <div class="history-item-main">
          <span class="history-date">${date}に作成</span>
          <strong>${plan.values.mood}・${plan.values.people}人分</strong>
          <span>朝 ${pattern.breakfast.name} / 昼 ${pattern.lunch.name} / 夜 ${pattern.dinner.name}</span>
        </div>
        <button type="button" class="load-bookmark-btn" data-history-index="${index}">この献立を開く</button>
      </article>
    `;
  }).join('');
}

function getShoppingChecks() {
  return getUserDataValue(shoppingChecksStorageKey, {});
}

function getShoppingKey(plan, mealName, ingredient) {
  return `${getPlanKey(plan)}-${mealName}-${ingredient}`;
}

function renderShoppingList() {
  const plan = resultPanel.currentPlan;
  if (!plan) {
    shoppingList.innerHTML = '<p class="empty-message">まず献立を作成してください</p>';
    return;
  }

  const selectedPattern = plan.patterns[resultPanel.currentPlanIndex || 0] || plan.patterns[0];
  const meals = [
    ['朝', selectedPattern.breakfast],
    ['昼', selectedPattern.lunch],
    ['夜', selectedPattern.dinner]
  ];
  const checks = getShoppingChecks();

  shoppingList.innerHTML = meals.map(([label, meal]) => `
    <section class="shopping-group">
      <h3>${label}・${meal.name}</h3>
      <div class="shopping-items">
        ${formatMealIngredients(meal, plan.values.people).map((ingredient) => {
          const key = getShoppingKey(plan, meal.name, ingredient);
          return `
            <label class="shopping-item">
              <input type="checkbox" data-shopping-key="${encodeURIComponent(key)}" ${checks[key] ? 'checked' : ''} />
              <span>${ingredient}</span>
            </label>
          `;
        }).join('')}
      </div>
    </section>
  `).join('');
}

function getBookmarks() {
  return getUserDataValue(bookmarksStorageKey, []);
}

function saveBookmarks(bookmarks) {
  setUserDataValue(bookmarksStorageKey, bookmarks);
}

function renderBookmarks() {
  const bookmarks = getBookmarks();
  bookmarkCount.textContent = bookmarks.length;
  clearBookmarksButton.style.display = bookmarks.length ? 'inline-flex' : 'none';

  if (!bookmarks.length) {
    bookmarksList.innerHTML = `
      <div class="bookmark-empty-state">
        <span class="bookmark-empty-icon" aria-hidden="true">🔖</span>
        <h3>登録しているものはありません。</h3>
        <p>献立を作成して、気に入ったものをブックマークしてみましょう。</p>
      </div>
    `;
    return;
  }

  bookmarksList.innerHTML = bookmarks.map((plan, index) => {
    const primaryPattern = plan.patterns[0];
    return `
      <article class="bookmark-item">
        <div>
          <strong>${plan.values.mood}・${plan.values.people}人分</strong>
          <span>朝: ${primaryPattern.breakfast.name}</span>
          <span>昼: ${primaryPattern.lunch.name}</span>
          <span>夜: ${primaryPattern.dinner.name}</span>
        </div>
        <div class="bookmark-actions">
          <button type="button" class="load-bookmark-btn" data-bookmark-index="${index}">表示</button>
          <button type="button" class="delete-bookmark-btn" data-delete-bookmark-index="${index}" aria-label="${plan.values.mood}のブックマークを削除">削除</button>
        </div>
      </article>
    `;
  }).join('');
}

function addBookmark(plan) {
  const bookmarks = getBookmarks();
  if (bookmarks.some((bookmark) => getPlanKey(bookmark) === getPlanKey(plan))) {
    return false;
  }

  bookmarks.unshift(plan);
  saveBookmarks(bookmarks);
  renderBookmarks();
  return true;
}

async function initializeAuthFlow() {
  const savedUser = getStoredCurrentUser();
  if (savedUser?.role === 'developer') {
    setAuthMode('developer');
    const developerPassword = sessionStorage.getItem(developerPasswordStorageKey);
    if (!developerPassword) {
      clearStoredCurrentUser();
      clearCurrentUser();
      showAuthView('開発者ログインの有効期限が切れました。専用パスワードを入力してください。');
      return;
    }
    try {
      await window.announcementsManager.authenticateDeveloper(developerPassword);
      completeSuccessfulLogin(savedUser);
    } catch (error) {
      console.error('開発者セッションを確認できませんでした', error);
      clearStoredCurrentUser();
      sessionStorage.removeItem(developerPasswordStorageKey);
      clearCurrentUser();
      showAuthView('開発者セッションを確認できませんでした。もう一度ログインしてください。');
    }
    return;
  }

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      if (data.session?.user) {
        const authUser = data.session.user;
        if (authUser.app_metadata?.role === 'developer') {
          await supabaseClient.auth.signOut();
          setAuthMode('developer');
          showAuthView('開発者ログインはメールアドレス不要です。専用パスワードでログインしてください。');
          return;
        }
        completeSuccessfulLogin({
          id: authUser.id,
          email: authUser.email,
          createdAt: authUser.created_at,
          role: 'user'
        });
        return;
      }
    } catch (error) {
      console.warn('Supabaseセッションの復元に失敗したため、ローカルセッションを確認します。', error);
    }
  }

  if (!savedUser) {
    setAuthMode('signin');
    showAuthView('メールアドレスでサインインしてください。');
    return;
  }

  const accounts = getStoredAccounts();
  const account = accounts.find((item) => item.id === savedUser.id || getSafeEmail(item.email) === getSafeEmail(savedUser.email));
  if (!account) {
    clearStoredCurrentUser();
    setAuthMode('signin');
    showAuthView('ログイン状態を確認できませんでした。もう一度サインインしてください。');
    return;
  }

  completeSuccessfulLogin({
    id: account.id,
    email: account.email,
    createdAt: account.createdAt,
    role: account.role || 'user'
  });
}

function hideSubpages() {
  bookmarksPage.hidden = true;
  shoppingPage.hidden = true;
  historyPage.hidden = true;
  announcementsPage.hidden = true;
  mealDetailPage.hidden = true;
  fridgePage.hidden = true;
  healthLogPage.hidden = true;
  mypagePanel.hidden = true;
  vocAdminPage.hidden = true;
  announcementAdminPage.hidden = true;
  registrantsPage.hidden = true;
}

function showPlanner() {
  hideSubpages();
  plannerView.hidden = false;
}

bookmarksList.addEventListener('click', (event) => {
  const loadButton = event.target.closest('[data-bookmark-index]');
  const deleteButton = event.target.closest('[data-delete-bookmark-index]');
  const bookmarks = getBookmarks();

  if (loadButton) {
    const plan = bookmarks[Number(loadButton.dataset.bookmarkIndex)];
    if (plan) {
      showPlanner();
      renderPlan(plan);
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (deleteButton) {
    bookmarks.splice(Number(deleteButton.dataset.deleteBookmarkIndex), 1);
    saveBookmarks(bookmarks);
    renderBookmarks();
  }
});

clearBookmarksButton.addEventListener('click', () => {
  saveBookmarks([]);
  renderBookmarks();
});

openBookmarksButton.addEventListener('click', () => {
  hideSubpages();
  renderBookmarks();
  plannerView.hidden = true;
  bookmarksPage.hidden = false;
  closeBookmarksButton.focus();
});

openAnnouncementsButton.addEventListener('click', openAnnouncementsPage);
closeAnnouncementsButton.addEventListener('click', showPlanner);

closeBookmarksButton.addEventListener('click', () => {
  showPlanner();
  openBookmarksButton.focus();
});

openShoppingButton.addEventListener('click', () => {
  hideSubpages();
  renderShoppingList();
  plannerView.hidden = true;
  shoppingPage.hidden = false;
  closeShoppingButton.focus();
});

closeShoppingButton.addEventListener('click', () => {
  showPlanner();
  openShoppingButton.focus();
});

shoppingList.addEventListener('change', (event) => {
  if (!event.target.matches('[data-shopping-key]')) return;
  const checks = getShoppingChecks();
  checks[decodeURIComponent(event.target.dataset.shoppingKey)] = event.target.checked;
  setUserDataValue(shoppingChecksStorageKey, checks);
});

openHistoryButton.addEventListener('click', () => {
  hideSubpages();
  renderHistory();
  plannerView.hidden = true;
  historyPage.hidden = false;
  closeHistoryButton.focus();
});

closeHistoryButton.addEventListener('click', () => {
  showPlanner();
  openHistoryButton.focus();
});

closeMealDetailButton.addEventListener('click', () => {
  showPlanner();
  resultPanel.focus();
});

recipeSearchInput.addEventListener('input', renderRecipeSearch);
document.getElementById('people').addEventListener('input', renderRecipeSearch);
recipeSearchResults.addEventListener('click', (event) => {
  const mealButton = event.target.closest('[data-search-meal]');
  if (!mealButton) return;

  const meal = JSON.parse(decodeURIComponent(mealButton.dataset.searchMeal));
  renderMealDetail(meal, 'レシピ検索', document.getElementById('people').value);
  hideSubpages();
  plannerView.hidden = true;
  mealDetailPage.hidden = false;
  closeMealDetailButton.focus();
});

openFridgeButton.addEventListener('click', () => {
  hideSubpages();
  renderFridgeIngredients();
  fridgeOtherList.innerHTML = '';
  fridgeOtherInput.value = '';
  fridgeOtherForm.hidden = true;
  otherFridgeButton.setAttribute('aria-expanded', 'false');
  fridgeResults.innerHTML = '<p class="empty-message">食材を選んで「この食材で探す」を押してください。</p>';
  plannerView.hidden = true;
  fridgePage.hidden = false;
  closeFridgeButton.focus();
});

closeFridgeButton.addEventListener('click', () => {
  showPlanner();
  openFridgeButton.focus();
});

manageHealthLogsButton.addEventListener('click', () => {
  hideSubpages();
  renderHealthLogs();
  plannerView.hidden = true;
  healthLogPage.hidden = false;
  closeHealthLogButton.focus();
});

closeHealthLogButton.addEventListener('click', () => {
  showPlanner();
  manageHealthLogsButton.focus();
});

healthLogList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-health-log-index]');
  if (!deleteButton) return;

  const logs = getEatenLogs();
  logs.splice(Number(deleteButton.dataset.deleteHealthLogIndex), 1);
  localStorage.setItem(eatenLogsStorageKey, JSON.stringify(logs));
  rebuildHealthScores();
  renderHealthLogs();
  renderHealthMaster();
});

clearHealthLogsButton.addEventListener('click', () => {
  setUserDataValue(eatenLogsStorageKey, []);
  rebuildHealthScores();
  renderHealthLogs();
  renderHealthMaster();
});

findFridgeMealsButton.addEventListener('click', renderFridgeResults);

fridgeIngredients.addEventListener('click', (event) => {
  const ingredientButton = event.target.closest('[data-fridge-ingredient]');
  if (!ingredientButton) return;
  const pressed = ingredientButton.getAttribute('aria-pressed') === 'true';
  ingredientButton.setAttribute('aria-pressed', String(!pressed));
});

otherFridgeButton.addEventListener('click', () => {
  const isOpen = !fridgeOtherForm.hidden;
  fridgeOtherForm.hidden = isOpen;
  otherFridgeButton.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) fridgeOtherInput.focus();
});

addFridgeOtherButton.addEventListener('click', addCustomFridgeIngredients);
fridgeOtherInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  addCustomFridgeIngredients();
});

fridgeOtherList.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-custom-fridge-ingredient]');
  if (chip) chip.remove();
});

clearFridgeButton.addEventListener('click', () => {
  fridgeIngredients.querySelectorAll('[data-fridge-ingredient]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
  });
  fridgeOtherList.innerHTML = '';
  fridgeOtherInput.value = '';
  renderFridgeResults();
});

fridgeResults.addEventListener('click', (event) => {
  const mealButton = event.target.closest('[data-fridge-meal]');
  if (!mealButton) return;

  const meal = JSON.parse(decodeURIComponent(mealButton.dataset.fridgeMeal));
  if (meal) {
    renderMealDetail(meal, '冷蔵庫レスキュー', document.getElementById('people').value);
    fridgePage.hidden = true;
    mealDetailPage.hidden = false;
    closeMealDetailButton.focus();
  }
});

recordHealthButton.addEventListener('click', () => {
  if (!resultPanel.currentPlan) return;
  const added = recordEatenPlan(resultPanel.currentPlan, resultPanel.currentPlanIndex || 0);
  recordHealthButton.textContent = added ? '✓ 今日の食卓を記録しました' : '本日は記録済み';
  recordHealthButton.disabled = true;
});

clearHistoryButton.addEventListener('click', () => {
  setUserDataValue(historyStorageKey, []);
  renderHistory();
});

historyList.addEventListener('click', (event) => {
  const loadButton = event.target.closest('[data-history-index]');
  if (!loadButton) return;

  const plan = getHistory()[Number(loadButton.dataset.historyIndex)];
  if (plan) {
    showPlanner();
    renderPlan(plan);
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

resultPanel.addEventListener('click', (event) => {
  const candidateButton = event.target.closest('[data-candidate-index]');
  if (candidateButton && resultPanel.currentPlan) {
    renderPlan(resultPanel.currentPlan, Number(candidateButton.dataset.candidateIndex));
    return;
  }

  const mealCard = event.target.closest('[data-meal-slot]');
  if (mealCard && resultPanel.currentPlan) {
    const slotLabels = { breakfast: '朝', lunch: '昼', dinner: '夜' };
    const selectedPattern = resultPanel.currentPlan.patterns[resultPanel.currentPlanIndex || 0] || resultPanel.currentPlan.patterns[0];
    const meal = selectedPattern[mealCard.dataset.mealSlot];
    if (meal) {
      renderMealDetail(meal, slotLabels[mealCard.dataset.mealSlot], resultPanel.currentPlan.values.people);
      plannerView.hidden = true;
      hideSubpages();
      mealDetailPage.hidden = false;
      closeMealDetailButton.focus();
    }
    return;
  }

  const recordButton = event.target.closest('[data-record-eaten]');
  if (recordButton && resultPanel.currentPlan) {
    const added = recordEatenPlan(resultPanel.currentPlan, resultPanel.currentPlanIndex || 0);
    recordButton.textContent = added ? '✓ 今日の食卓を記録しました' : '本日は記録済み';
    recordButton.disabled = true;
    return;
  }

  const bookmarkButton = event.target.closest('[data-bookmark-plan]');
  if (!bookmarkButton) return;

  const plan = JSON.parse(decodeURIComponent(bookmarkButton.dataset.bookmarkPlan));
  const added = addBookmark(plan);
  bookmarkButton.textContent = added ? '✓ ブックマークしました' : '✓ 保存済みの献立です';
  bookmarkButton.disabled = true;
});

resultPanel.addEventListener('keydown', (event) => {
  if ((event.key !== 'Enter' && event.key !== ' ') || !event.target.matches('[data-meal-slot]')) return;
  event.preventDefault();
  event.target.click();
});

authForm.addEventListener('submit', handleAuthSubmit);
authSwitchButton.addEventListener('click', () => {
  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  authEmailInput.focus();
});
devLoginButton.addEventListener('click', handleDeveloperLogin);
authBackButton.addEventListener('click', returnToUserLogin);
mypageButton.addEventListener('click', openMypage);
closeMypageButton.addEventListener('click', closeMypage);
mypageForm.addEventListener('submit', handleMypageSubmit);
logoutFromMypageButton.addEventListener('click', handleLogout);
exportDataButton.addEventListener('click', exportUserData);
resetLocalDataButton.addEventListener('click', resetUserLocalData);
deleteAccountButton.addEventListener('click', handleDeleteAccount);
openRegistrantsButton.addEventListener('click', openRegistrantsPage);
closeRegistrantsButton.addEventListener('click', closeRegistrantsPage);
openAnnouncementAdminButton.addEventListener('click', openAnnouncementAdminPage);
closeAnnouncementAdminButton.addEventListener('click', openVocAdminPage);
announcementRefreshButton.addEventListener('click', () => window.announcementsManager?.loadAdmin());
registrantsSearch.addEventListener('input', renderRegistrants);
registrantsRefreshButton.addEventListener('click', renderRegistrants);
registrantsExportButton.addEventListener('click', exportRegistrantsCsv);
registrantsTableBody.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-registrant]');
  if (deleteButton) deleteRegistrant(deleteButton.dataset.deleteRegistrant);
});
document.addEventListener('click', (event) => {
  const toggleButton = event.target.closest('[data-password-toggle]');
  if (toggleButton) {
    togglePasswordVisibility(event);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!getCurrentUser()) {
    showAuthView('献立を作成するにはログインしてください。');
    return;
  }

  const values = {
    mood: document.getElementById('mood').value,
    balance: document.getElementById('balance').value,
    people: document.getElementById('people').value,
    budget: document.getElementById('budget').value
  };
  const plan = createPlan(values);
  renderPlan(plan);
  saveHistory(plan);
});

initializeAuthFlow();

renderBookmarks();
renderHistory();
renderHealthMaster();
renderRecipeSearch();
