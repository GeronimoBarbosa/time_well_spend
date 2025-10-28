
(() => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const el = {
    prev: document.getElementById("prevMonth"),
    next: document.getElementById("nextMonth"),
    month: document.getElementById("currentMonth"),
    days: document.getElementById("calendarDays"),
    selectedDate: document.getElementById("selectedDate"),
    taskInput: document.getElementById("taskInput"),
    taskType: document.getElementById("taskType"),
    addTaskBtn: document.getElementById("addTaskBtn"),
    taskList: document.getElementById("taskList"),
    // Gamification
    points: document.getElementById("points"),
    level: document.getElementById("level"),
    streakDays: document.getElementById("streakDays"),
    achievementsList: document.getElementById("achievementsList"),
    // Analytics
    analyticsHourly: document.getElementById("analyticsHourly"),
    analyticsByType: document.getElementById("analyticsByType"),
    analyticsWeekday: document.getElementById("analyticsWeekday"),
    // Pomodoro
    pomodoroTimer: document.getElementById("pomodoroTimer"),
    pomodoroStart: document.getElementById("pomodoroStart"),
    pomodoroPause: document.getElementById("pomodoroPause"),
    pomodoroReset: document.getElementById("pomodoroReset"),
    pomodoroWork: document.getElementById("pomodoroWork"),
    pomodoroBreak: document.getElementById("pomodoroBreak"),
    pomodoroSound: document.getElementById("pomodoroSound"),
    pomodoroCount: document.getElementById("pomodoroCount"),
    focusBlocker: document.getElementById("focusBlocker"),
    soundBell: document.getElementById("sound-bell"),
    soundChime: document.getElementById("sound-chime"),
    // Journal
    dailyJournalText: document.getElementById("dailyJournalText"),
    saveJournalBtn: document.getElementById("saveJournalBtn"),
    // Commitments
    commitText: document.getElementById("commitText"),
    saveCommit: document.getElementById("saveCommit"),
    shareCommit: document.getElementById("shareCommit"),
    copyCommit: document.getElementById("copyCommit"),
    commitList: document.getElementById("commitList"),
    // Energy planner
    energyMorning: document.getElementById("energyMorning"),
    energyAfternoon: document.getElementById("energyAfternoon"),
    energyEvening: document.getElementById("energyEvening"),
    energyHeatmap: document.getElementById("energyHeatmap"),
    // Techniques library
    techniquesList: document.getElementById("techniquesList"),
    resetTechniques: document.getElementById("resetTechniques"),
    // 9-12 extras
    dndSwitch: document.getElementById("dndSwitch"),
    dndCounter: document.getElementById("dndCounter"),
    goalsInput: document.getElementById("goalsInput"),
    saveGoals: document.getElementById("saveGoals"),
    impactSummary: document.getElementById("impactSummary"),
    partnerName: document.getElementById("partnerName"),
    pairPartner: document.getElementById("pairPartner"),
    checkInBtn: document.getElementById("checkInBtn"),
    checkInList: document.getElementById("checkInList"),
    qualityAvg: document.getElementById("qualityAvg"),
    qualityByType: document.getElementById("qualityByType"),
    // 13-16 extras
    microHabitsList: document.getElementById("microHabitsList"),
    resetMicroHabits: document.getElementById("resetMicroHabits"),
    microHabitCount: document.getElementById("microHabitCount"),
    rewardsList: document.getElementById("rewardsList"),
    habitChainSelect: document.getElementById("habitChainSelect"),
    habitChainGrid: document.getElementById("habitChainGrid"),
    breakdownTaskSelect: document.getElementById("breakdownTaskSelect"),
    subtaskInput: document.getElementById("subtaskInput"),
    addSubtaskBtn: document.getElementById("addSubtaskBtn"),
    subtaskList: document.getElementById("subtaskList"),
    // 17-20 extras
    bioStress: document.getElementById("bioStress"),
    bioFatigue: document.getElementById("bioFatigue"),
    saveBio: document.getElementById("saveBio"),
    bioAdvice: document.getElementById("bioAdvice"),
    generateNarrative: document.getElementById("generateNarrative"),
    narrativesList: document.getElementById("narrativesList"),
    challengeSelect: document.getElementById("challengeSelect"),
    startChallenge: document.getElementById("startChallenge"),
    markChallengeDay: document.getElementById("markChallengeDay"),
    challengeProgress: document.getElementById("challengeProgress"),
    synergySuggestions: document.getElementById("synergySuggestions"),
    refreshSynergies: document.getElementById("refreshSynergies"),
  };

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-11
  let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // ---- Persistence helpers ----
  function loadJSON(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  }

  // ---- Micro Habits ----
  function renderMicroHabits(){
    if (!el.microHabitsList) return;
    el.microHabitsList.innerHTML = "";
    const key = dateKey(selected);
    const done = new Set(microHabits[key] || []);
    MICRO_HABITS.forEach(h => {
      const li = document.createElement("li");
      const chk = document.createElement("input"); chk.type = "checkbox"; chk.className = "form-check-input me-2"; chk.checked = done.has(h.id);
      chk.addEventListener("change", ()=>{
        const arr = new Set(microHabits[key] || []);
        if (chk.checked) arr.add(h.id); else arr.delete(h.id);
        microHabits[key] = Array.from(arr);
        saveJSON("tws-microhabits", microHabits);
        updateMicroHabitCount();
      });
      const label = document.createElement("label"); label.textContent = h.title;
      li.appendChild(chk); li.appendChild(label);
      el.microHabitsList.appendChild(li);
    });
    updateMicroHabitCount();
  }
  function updateMicroHabitCount(){
    if (!el.microHabitCount) return;
    const key = dateKey(selected);
    el.microHabitCount.textContent = String((microHabits[key]||[]).length);
  }
  function resetMicroHabitsHandler(){
    const key = dateKey(selected); microHabits[key] = []; saveJSON("tws-microhabits", microHabits); renderMicroHabits();
  }

  // ---- Rewards ----
  function computeRewards(){
    REWARDS.forEach(r => { if (!rewardsUnlocked.includes(r.id) && r.condition(userStats, analytics)) rewardsUnlocked.push(r.id); });
    saveJSON("tws-rewards", rewardsUnlocked);
  }
  function renderRewards(){
    if (!el.rewardsList) return;
    el.rewardsList.innerHTML = "";
    REWARDS.forEach(r => {
      const li = document.createElement("li");
      const unlocked = rewardsUnlocked.includes(r.id);
      li.innerHTML = `<span class="badge ${unlocked? 'bg-success':'bg-secondary'} me-2">${unlocked? 'Desbloqueado':'Bloqueado'}</span>${r.title}`;
      el.rewardsList.appendChild(li);
    });
  }

  // ---- Habit Chains ----
  function fillHabitChainSelect(){
    if (!el.habitChainSelect) return;
    const types = ["general","creativa","administrativa","estudio","salud"];
    el.habitChainSelect.innerHTML = types.map(t=>`<option value="${t}">${t}</option>`).join("");
  }
  function renderHabitChain(){
    if (!el.habitChainGrid || !el.habitChainSelect) return;
    const type = el.habitChainSelect.value || "general";
    el.habitChainGrid.innerHTML = "";
    for (let i=29; i>=0; i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const cell = document.createElement("div"); cell.className = "chain-cell"; cell.title = d.toLocaleDateString();
      const tasks = loadTasks(d);
      if (tasks.some(t=>t.done && (t.type||"general")===type)) cell.classList.add("active");
      el.habitChainGrid.appendChild(cell);
    }
  }

  // ---- Task Breakdown (Subtasks) ----
  function refreshBreakdownTaskOptions(){
    if (!el.breakdownTaskSelect) return;
    const tasks = loadTasks(selected);
    el.breakdownTaskSelect.innerHTML = tasks.map(t=>`<option value="${t.id||''}">${t.text}</option>`).join("");
    renderSubtasks();
  }
  function renderSubtasks(){
    if (!el.subtaskList) return;
    el.subtaskList.innerHTML = "";
    const taskId = el.breakdownTaskSelect?.value;
    if (!taskId) return;
    const list = subtasksByTask[taskId] || [];
    list.forEach((st, idx)=>{
      const li = document.createElement("li"); li.className = "list-group-item d-flex justify-content-between align-items-center";
      const left = document.createElement("div"); left.className = "d-flex align-items-center gap-2";
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!st.done; cb.addEventListener("change",()=>{ st.done = cb.checked; saveJSON("tws-subtasks", subtasksByTask); });
      const span = document.createElement("span"); span.textContent = st.text; if (st.done) span.style.textDecoration = 'line-through'; cb.addEventListener("change",()=>{ span.style.textDecoration = cb.checked? 'line-through':'none'; });
      left.appendChild(cb); left.appendChild(span);
      const del = document.createElement("button"); del.className = "btn btn-sm btn-outline-danger"; del.textContent = "Eliminar"; del.addEventListener("click",()=>{ list.splice(idx,1); subtasksByTask[taskId] = list; saveJSON("tws-subtasks", subtasksByTask); renderSubtasks(); });
      li.appendChild(left); li.appendChild(del); el.subtaskList.appendChild(li);
    });
  }
  function addSubtask(){
    const taskId = el.breakdownTaskSelect?.value; if (!taskId) return;
    const text = (el.subtaskInput?.value||"").trim(); if (!text) return;
    const list = subtasksByTask[taskId] || []; list.push({ id: Date.now(), text, done:false });
    subtasksByTask[taskId] = list; saveJSON("tws-subtasks", subtasksByTask);
    el.subtaskInput.value = ""; renderSubtasks();
  }
  function saveJSON(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  // ---- Bio Feedback (Simulated) ----
  function saveBioHandler(){
    if (!el.bioStress || !el.bioFatigue) return;
    const key = dateKey(selected);
    const stress = Math.max(1, Math.min(5, parseInt(el.bioStress.value||'3',10)));
    const fatigue = Math.max(1, Math.min(5, parseInt(el.bioFatigue.value||'3',10)));
    bioLog[key] = { stress, fatigue, at: new Date().toISOString() };
    saveJSON("tws-bio", bioLog);
    renderBioAdvice(stress, fatigue);
  }
  function renderBioAdvice(stress, fatigue){
    if (!el.bioAdvice) return;
    let advice = "";
    if (stress >=4) advice += "Respira 2 minutos y elige una micro-tarea. ";
    if (fatigue >=4) advice += "Haz un descanso breve o tareas de baja energía. ";
    if (!advice) advice = "Buen estado: prioriza tareas de alta energía.";
    el.bioAdvice.textContent = advice;
  }

  // ---- Motivational Narratives ----
  function generateNarrativeHandler(){
    const chapters = achievements.length;
    const text = `Capítulo ${chapters+1}: Has alcanzado ${userStats.points} puntos, nivel ${userStats.level} y una racha de ${userStats.streak} días. Sigue construyendo tu historia.`;
    narratives.push({ id: Date.now(), text, date: new Date().toISOString() });
    saveJSON("tws-narratives", narratives);
    renderNarratives();
  }
  function renderNarratives(){
    if (!el.narrativesList) return;
    el.narrativesList.innerHTML = "";
    narratives.slice().reverse().forEach(n=>{
      const li = document.createElement("li");
      li.textContent = `${new Date(n.date).toLocaleString()} · ${n.text}`;
      el.narrativesList.appendChild(li);
    });
  }

  // ---- Temporal Challenges ----
  function challengeTotalDays(id){
    if (id==='zero') return 7; if (id==='21habitos') return 21; if (id==='maraton') return 14; return 0;
  }
  function startChallengeHandler(){
    const id = el.challengeSelect?.value || 'zero';
    challenge = { id, totalDays: challengeTotalDays(id), startedAt: new Date().toISOString(), daysDone: [] };
    saveJSON("tws-challenge", challenge);
    renderChallengeProgress();
  }
  function markChallengeDayHandler(){
    if (!challenge) return;
    const key = dateKey(new Date());
    if (!challenge.daysDone.includes(key)) challenge.daysDone.push(key);
    saveJSON("tws-challenge", challenge);
    renderChallengeProgress();
  }
  function renderChallengeProgress(){
    if (!el.challengeProgress) return;
    const done = challenge?.daysDone?.length || 0;
    const total = challenge?.totalDays || 0;
    el.challengeProgress.textContent = `${done}/${total}`;
  }

  // ---- Task Synergies ----
  function refreshSynergies(){
    if (!el.synergySuggestions) return;
    const tasks = loadTasks(selected);
    const byType = {};
    const byEnergy = {};
    tasks.filter(t=>!t.done).forEach(t=>{
      const type = t.type||'general'; const energy=t.energy||'media';
      byType[type] = (byType[type]||0)+1;
      byEnergy[energy] = (byEnergy[energy]||0)+1;
    });
    const suggestions = [];
    Object.entries(byType).forEach(([k,v])=>{ if (v>=2) suggestions.push(`Agrupa ${v} tareas del tipo ${k}.`); });
    Object.entries(byEnergy).forEach(([k,v])=>{ if (v>=2) suggestions.push(`Reserva un bloque para ${v} tareas de energía ${k}.`); });
    el.synergySuggestions.innerHTML = suggestions.length ? `<ul>${suggestions.map(s=>`<li>${s}</li>`).join('')}</ul>` : '<span class="text-muted">Sin sugerencias por ahora</span>';
  }

  // ---- Gamification State ----
  const LEVEL_POINTS = 100;
  const POINTS_PER_TASK = 10;
  let userStats = loadJSON("tws-user-stats", { points: 0, level: 1, streak: 0, lastCompletedDate: null });
  let achievements = loadJSON("tws-achievements", []); // [{id,title,date}]

  // ---- Analytics State ----
  let analytics = loadJSON("tws-analytics", {
    byHour: Array(24).fill(0),
    byType: {},
    byWeekday: Array(7).fill(0), // 0=Dom
    pomodorosToday: 0,
    lastPomodoroDate: null,
    qualityByType: {},
    qualityDate: null,
  });

  // ---- Journal State ----
  let journal = loadJSON("tws-journal", {}); // {dateKey: text}
  let commitments = loadJSON("tws-commitments", []); // [{id,text,date}]
  let energyPlan = loadJSON("tws-energy", {}); // {dateKey:{morning,afternoon,evening}}
  let techniquesProgress = loadJSON("tws-techniques", { done: [] }); // {done:[ids]}
  let ambassadorByDate = loadJSON("tws-ambassador", {}); // {dateKey: taskId}
  let dnd = loadJSON("tws-dnd", { running: false, startedAt: null, focusedTodaySec: 0, date: null });
  let goals = loadJSON("tws-goals", []); // ["Salud","Proyecto X"]
  let partner = loadJSON("tws-partner", { name: "", checkIns: [] });
  let dndInterval = null;
  // 13-16 state
  const MICRO_HABITS = [
    { id: "agua", title: "Beber agua" },
    { id: "respirar", title: "Respiración 2 min" },
    { id: "estirar", title: "Estirar 2 min" },
    { id: "orden", title: "Orden rápido" },
  ];
  let microHabits = loadJSON("tws-microhabits", {}); // {dateKey: [ids]}
  const REWARDS = [
    { id: "p100", title: "Plantilla Premium A", condition: (s,a)=>s.points>=100 },
    { id: "streak7", title: "Contenido Exclusivo 1", condition: (s,a)=>s.streak>=7 },
    { id: "pomos10", title: "Descuento Herramienta X", condition: (s,a)=> (a.pomodorosToday||0) >= 10 },
  ];
  let rewardsUnlocked = loadJSON("tws-rewards", []);
  let subtasksByTask = loadJSON("tws-subtasks", {}); // {taskId: [{id,text,done}]}
  // 17-20 state
  let bioLog = loadJSON("tws-bio", {}); // {dateKey: {stress,fatigue}}
  let narratives = loadJSON("tws-narratives", []); // [{id,text,date}]
  let challenge = loadJSON("tws-challenge", null); // {id,totalDays,startedAt,daysDone: string[]}

  // ---- Pomodoro State ----
  let pomodoro = loadJSON("tws-pomodoro", {
    work: 25,
    break: 5,
    phase: "work",
    remainingSec: 25 * 60,
    running: false,
  });
  let pomodoroInterval = null;

  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  // ---- Gamification & Analytics ----
  function ensureLevel() {
    const newLevel = Math.max(1, Math.floor(userStats.points / LEVEL_POINTS) + 1);
    userStats.level = newLevel;
  }
  function setLastCompletedAndStreak(dateStr) {
    const prev = userStats.lastCompletedDate ? new Date(userStats.lastCompletedDate) : null;
    const curr = new Date(dateStr);
    // Normalize to date-only
    const p = prev ? new Date(prev.getFullYear(), prev.getMonth(), prev.getDate()) : null;
    const c = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());
    if (!p) {
      userStats.streak = 1;
    } else {
      const diffDays = Math.round((c - p) / 86400000);
      if (diffDays === 1) userStats.streak += 1;
      else if (diffDays === 0) userStats.streak = Math.max(userStats.streak, 1);
      else userStats.streak = 1;
    }
    userStats.lastCompletedDate = c.toISOString();
  }
  function checkAchievements() {
    function unlock(id, title) {
      if (!achievements.find(a => a.id === id)) {
        achievements.push({ id, title, date: new Date().toISOString() });
      }
    }
    // Novato Productivo: 5 tareas seguidas (streak >=5)
    if (userStats.streak >= 5) unlock("novato-5", "Novato Productivo");
    // Maestro del Tiempo: nivel 10
    if (userStats.level >= 10) unlock("maestro-10", "Maestro del Tiempo");
    // Semana Perfecta: 7 días seguidos con al menos 1 tarea completada
    if (hasSevenDayCompletionStreak()) unlock("semana-perfecta", "Semana Perfecta");
  }
  function hasSevenDayCompletionStreak() {
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const tasks = loadTasks(d);
      if (!tasks.some(t => t.done)) return false;
    }
    return true;
  }
  function updateGamificationUI() {
    if (el.points) el.points.textContent = userStats.points;
    if (el.level) el.level.textContent = userStats.level;
    if (el.streakDays) el.streakDays.textContent = userStats.streak;
    if (el.achievementsList) {
      el.achievementsList.innerHTML = "";
      achievements.slice().reverse().forEach(a => {
        const li = document.createElement("li");
        li.textContent = a.title;
        el.achievementsList.appendChild(li);
      });
    }
  }
  function recordAnalyticsOnComplete(task) {
    const completed = new Date();
    const h = completed.getHours();
    analytics.byHour[h] = (analytics.byHour[h] || 0) + 1;
    const t = task.type || "general";
    analytics.byType[t] = (analytics.byType[t] || 0) + 1;
    const wd = completed.getDay();
    analytics.byWeekday[wd] = (analytics.byWeekday[wd] || 0) + 1;
    // Quality (today)
    const todayKey = dateKey(new Date());
    if (analytics.qualityDate !== todayKey) {
      analytics.qualityDate = todayKey;
      analytics.qualityByType = {};
    }
    analytics.qualityByType[t] = (analytics.qualityByType[t] || 0) + 1;
  }
  function renderMiniBars(container, dataPairs) {
    if (!container) return;
    container.innerHTML = "";
    const max = Math.max(1, ...dataPairs.map(([_, v]) => v));
    dataPairs.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "mini-bar-row";
      const l = document.createElement("span"); l.className = "mini-bar-label"; l.textContent = label;
      const bar = document.createElement("div"); bar.className = "mini-bar";
      const fill = document.createElement("div"); fill.className = "mini-bar-fill"; fill.style.width = `${(value / max) * 100}%`;
      const val = document.createElement("span"); val.className = "mini-bar-value"; val.textContent = String(value);
      bar.appendChild(fill);
      row.appendChild(l); row.appendChild(bar); row.appendChild(val);
      container.appendChild(row);
    });
  }
  function updateAnalyticsUI() {
    if (el.analyticsHourly) {
      const pairs = Array.from({length:24}, (_,i)=>[String(i).padStart(2,'0'), analytics.byHour[i] || 0]);
      renderMiniBars(el.analyticsHourly, pairs);
    }
    if (el.analyticsByType) {
      const pairs = Object.entries(analytics.byType);
      renderMiniBars(el.analyticsByType, pairs.length ? pairs : [["general",0]]);
    }
    if (el.analyticsWeekday) {
      const names = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
      const pairs = names.map((n,i)=>[n, analytics.byWeekday[i] || 0]);
      renderMiniBars(el.analyticsWeekday, pairs);
    }
    if (el.pomodoroCount) {
      const todayKey = dateKey(new Date());
      const lastKey = analytics.lastPomodoroDate;
      if (lastKey !== todayKey) analytics.pomodorosToday = 0;
      el.pomodoroCount.textContent = String(analytics.pomodorosToday || 0);
    }
    // Quality UI
    if (el.qualityByType) {
      const pairs = Object.entries(analytics.qualityByType || {});
      renderMiniBars(el.qualityByType, pairs.length ? pairs : [["general",0]]);
    }
    if (el.qualityAvg) {
      const totalToday = Object.values(analytics.qualityByType || {}).reduce((a,b)=>a+b,0);
      const avg = Math.max(1, Math.min(5, Math.round(totalToday / 2) + 1));
      el.qualityAvg.textContent = String(avg);
    }
  }
  function persistMeta() {
    saveJSON("tws-user-stats", userStats);
    saveJSON("tws-achievements", achievements);
    saveJSON("tws-analytics", analytics);
  }
  function onTaskStatusChange(task, isDone) {
    if (isDone) {
      userStats.points += POINTS_PER_TASK;
      ensureLevel();
      setLastCompletedAndStreak(new Date());
      const before = achievements.length;
      checkAchievements();
      const after = achievements.length;
      if (after > before) {
        const chapters = achievements.length;
        const text = `Capítulo ${chapters}: ¡Nuevo logro desbloqueado! Puntos: ${userStats.points}, Nivel: ${userStats.level}, Racha: ${userStats.streak} días.`;
        narratives.push({ id: Date.now(), text, date: new Date().toISOString() });
        saveJSON("tws-narratives", narratives);
        renderNarratives();
      }
      recordAnalyticsOnComplete(task);
      persistMeta();
      updateGamificationUI();
      updateAnalyticsUI();
      // Update rewards after progression
      computeRewards();
      renderRewards();
    } else {
      // No restamos puntos para mantener motivación positiva
    }
  }

  // ---- Journal ----
  function loadJournalForSelected() {
    if (!el.dailyJournalText) return;
    const key = dateKey(selected);
    el.dailyJournalText.value = journal[key] || "";
  }
  function saveJournalForSelected() {
    if (!el.dailyJournalText) return;
    const key = dateKey(selected);
    journal[key] = el.dailyJournalText.value;
    saveJSON("tws-journal", journal);
  }

  // ---- Pomodoro ----
  function syncPomodoroInputs() {
    if (el.pomodoroWork) el.pomodoroWork.value = pomodoro.work;
    if (el.pomodoroBreak) el.pomodoroBreak.value = pomodoro.break;
    updatePomodoroTimerText();
  }
  function updatePomodoroTimerText() {
    if (!el.pomodoroTimer) return;
    const m = Math.floor(pomodoro.remainingSec / 60);
    const s = pomodoro.remainingSec % 60;
    el.pomodoroTimer.textContent = `${pad(m)}:${pad(s)}`;
  }
  function playPomodoroSound() {
    const sel = el.pomodoroSound ? el.pomodoroSound.value : "none";
    if (sel === "bell" && el.soundBell) el.soundBell.play().catch(()=>{});
    if (sel === "chime" && el.soundChime) el.soundChime.play().catch(()=>{});
  }
  function switchPhase() {
    if (pomodoro.phase === "work") {
      pomodoro.phase = "break";
      pomodoro.remainingSec = (pomodoro.break || 5) * 60;
      // count pomodoro
      analytics.lastPomodoroDate = dateKey(new Date());
      analytics.pomodorosToday = (analytics.pomodorosToday || 0) + 1;
      saveJSON("tws-analytics", analytics);
      updateAnalyticsUI();
      // Recompute rewards in case of pomodoro-based rewards
      computeRewards();
      renderRewards();
    } else {
      pomodoro.phase = "work";
      pomodoro.remainingSec = (pomodoro.work || 25) * 60;
    }
    playPomodoroSound();
    saveJSON("tws-pomodoro", pomodoro);
    updatePomodoroTimerText();
  }
  function tickPomodoro() {
    if (!pomodoro.running) return;
    if (pomodoro.remainingSec > 0) {
      pomodoro.remainingSec -= 1;
      updatePomodoroTimerText();
      if (pomodoro.remainingSec === 0) switchPhase();
      saveJSON("tws-pomodoro", pomodoro);
    }
  }
  function startPomodoro() {
    if (pomodoro.running) return;
    pomodoro.running = true;
    saveJSON("tws-pomodoro", pomodoro);
    if (!pomodoroInterval) pomodoroInterval = setInterval(tickPomodoro, 1000);
    if (el.focusBlocker && el.focusBlocker.checked) showFocusOverlay(true);
  }
  function pausePomodoro() {
    pomodoro.running = false;
    saveJSON("tws-pomodoro", pomodoro);
  }
  function resetPomodoro() {
    pomodoro.running = false;
    pomodoro.phase = "work";
    pomodoro.remainingSec = (pomodoro.work || 25) * 60;
    saveJSON("tws-pomodoro", pomodoro);
    updatePomodoroTimerText();
    showFocusOverlay(false);
  }
  function showFocusOverlay(show) {
    let ov = document.getElementById("focus-overlay");
    if (show) {
      if (!ov) {
        ov = document.createElement("div");
        ov.id = "focus-overlay";
        ov.textContent = "Modo Enfoque Activado";
        document.body.appendChild(ov);
      }
      ov.style.display = "flex";
    } else if (ov) {
      ov.style.display = "none";
    }
  }

  function dateKey(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function setSelectedLabel(d) {
    try {
      el.selectedDate.textContent = d.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      el.selectedDate.textContent = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
  }

  function loadTasks(d) {
    const raw = localStorage.getItem("tasks-" + dateKey(d));
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveTasks(d, tasks) {
    localStorage.setItem("tasks-" + dateKey(d), JSON.stringify(tasks));
  }

  function renderTasks() {
    const tasks = loadTasks(selected);
    el.taskList.innerHTML = "";
    tasks.forEach((t, idx) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex align-items-center justify-content-between";

      const left = document.createElement("div");
      left.className = "d-flex align-items-center gap-2";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!t.done;
      cb.addEventListener("change", () => {
        const current = loadTasks(selected);
        if (current[idx]) {
          current[idx].done = cb.checked;
          current[idx].completedAt = cb.checked ? new Date().toISOString() : null;
          saveTasks(selected, current);
          onTaskStatusChange(current[idx], cb.checked);
        }
      });
      const span = document.createElement("span");
      const energyTag = t.energy ? ` · ${t.energy}` : "";
      span.textContent = t.text + (t.type ? ` · ${t.type}` : "") + energyTag;
      if (t.done) span.style.textDecoration = "line-through";
      cb.addEventListener("change", () => {
        span.style.textDecoration = cb.checked ? "line-through" : "none";
      });
      left.appendChild(cb);
      left.appendChild(span);

      const actions = document.createElement("div");
      actions.className = "d-flex align-items-center gap-2";

      // Ambassador toggle
      const amb = document.createElement("button");
      amb.className = "btn btn-sm btn-outline-warning ambassador-toggle";
      amb.title = "Marcar como embajadora del día";
      amb.innerHTML = "★";
      const key = dateKey(selected);
      const taskId = t.id || `${key}-${idx}`;
      if (ambassadorByDate[key] === taskId) amb.classList.add("active");
      amb.addEventListener("click", () => {
        if (ambassadorByDate[key] === taskId) {
          delete ambassadorByDate[key];
        } else {
          ambassadorByDate[key] = taskId;
        }
        saveJSON("tws-ambassador", ambassadorByDate);
        renderTasks();
      });

      const del = document.createElement("button");
      del.className = "btn btn-sm btn-outline-danger";
      del.textContent = "Eliminar";
      del.addEventListener("click", () => {
        const current = loadTasks(selected);
        current.splice(idx, 1);
        saveTasks(selected, current);
        renderTasks();
        // lightweight: we do not rollback points; analytics stays as historical
      });

      actions.appendChild(amb);
      actions.appendChild(del);
      li.appendChild(left);
      li.appendChild(actions);
      el.taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = (el.taskInput.value || "").trim();
    if (!text) return;
    const type = el.taskType ? (el.taskType.value || "general") : "general";
    const energy = el.taskEnergy ? (el.taskEnergy.value || "media") : "media";
    const tasks = loadTasks(selected);
    tasks.push({ id: Date.now(), text, type, energy, done: false, createdAt: new Date().toISOString(), completedAt: null });
    saveTasks(selected, tasks);
    el.taskInput.value = "";
    if (el.taskType) el.taskType.value = "general";
    if (el.taskEnergy) el.taskEnergy.value = "media";
    renderTasks();
  }

  function renderCalendar() {
    el.month.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    el.days.innerHTML = "";

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay(); // 0=Dom .. 6=Sab
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < startWeekday; i++) {
      const blank = document.createElement("div");
      blank.className = "calendar-day empty";
      el.days.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar-day btn btn-light";
      btn.textContent = String(day);

      const isToday = d.toDateString() === today.toDateString();
      const isSelected = d.toDateString() === selected.toDateString();
      if (isToday) btn.classList.add("today");
      if (isSelected) btn.classList.add("active");

      btn.addEventListener("click", () => {
        selected = d;
        setSelectedLabel(selected);
        renderTasks();
        renderCalendar();
        loadJournalForSelected();
        loadEnergyForSelected();
      });

      el.days.appendChild(btn);
    }
  }

  el.prev.addEventListener("click", () => {
    if (viewMonth === 0) {
      viewMonth = 11;
      viewYear -= 1;
    } else {
      viewMonth -= 1;
    }
    renderCalendar();
  });

  el.next.addEventListener("click", () => {
    if (viewMonth === 11) {
      viewMonth = 0;
      viewYear += 1;
    } else {
      viewMonth += 1;
    }
    renderCalendar();
  });

  el.addTaskBtn.addEventListener("click", addTask);
  el.taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Commitments events
  if (el.saveCommit) el.saveCommit.addEventListener("click", saveCommit);
  if (el.shareCommit) el.shareCommit.addEventListener("click", shareCommit);
  if (el.copyCommit) el.copyCommit.addEventListener("click", copyCommit);

  // Energy planner events
  if (el.energyMorning) el.energyMorning.addEventListener("change", saveEnergyForSelected);
  if (el.energyAfternoon) el.energyAfternoon.addEventListener("change", saveEnergyForSelected);
  if (el.energyEvening) el.energyEvening.addEventListener("change", saveEnergyForSelected);

  // Techniques events
  if (el.resetTechniques) el.resetTechniques.addEventListener("click", resetTechniques);
  // 13-16 events
  if (el.resetMicroHabits) el.resetMicroHabits.addEventListener("click", resetMicroHabitsHandler);
  if (el.habitChainSelect) el.habitChainSelect.addEventListener("change", renderHabitChain);
  if (el.breakdownTaskSelect) el.breakdownTaskSelect.addEventListener("change", renderSubtasks);
  if (el.addSubtaskBtn) el.addSubtaskBtn.addEventListener("click", addSubtask);
  // 17-20 events
  if (el.saveBio) el.saveBio.addEventListener("click", saveBioHandler);
  if (el.generateNarrative) el.generateNarrative.addEventListener("click", generateNarrativeHandler);
  if (el.startChallenge) el.startChallenge.addEventListener("click", startChallengeHandler);
  if (el.markChallengeDay) el.markChallengeDay.addEventListener("click", markChallengeDayHandler);
  if (el.refreshSynergies) el.refreshSynergies.addEventListener("click", refreshSynergies);

  // Pomodoro events
  if (el.pomodoroStart) el.pomodoroStart.addEventListener("click", startPomodoro);
  if (el.pomodoroPause) el.pomodoroPause.addEventListener("click", pausePomodoro);
  if (el.pomodoroReset) el.pomodoroReset.addEventListener("click", resetPomodoro);
  if (el.pomodoroWork) el.pomodoroWork.addEventListener("change", () => {
    pomodoro.work = Math.max(5, parseInt(el.pomodoroWork.value || "25", 10));
    if (pomodoro.phase === "work" && !pomodoro.running) pomodoro.remainingSec = pomodoro.work * 60;
    saveJSON("tws-pomodoro", pomodoro);
    updatePomodoroTimerText();
  });
  if (el.pomodoroBreak) el.pomodoroBreak.addEventListener("change", () => {
    pomodoro.break = Math.max(1, parseInt(el.pomodoroBreak.value || "5", 10));
    if (pomodoro.phase === "break" && !pomodoro.running) pomodoro.remainingSec = pomodoro.break * 60;
    saveJSON("tws-pomodoro", pomodoro);
    updatePomodoroTimerText();
  });
  if (el.focusBlocker) el.focusBlocker.addEventListener("change", () => {
    if (el.focusBlocker.checked && pomodoro.running) showFocusOverlay(true);
    else showFocusOverlay(false);
  });
  if (!pomodoroInterval) pomodoroInterval = setInterval(tickPomodoro, 1000);

  // Journal events
  if (el.saveJournalBtn) el.saveJournalBtn.addEventListener("click", saveJournalForSelected);

  // DND events
  function fmtHMS(sec){
    const h = Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  function tickDND(){
    if (!dnd.running) return;
    const todayK = dateKey(new Date());
    if (dnd.date !== todayK){ dnd.date = todayK; dnd.focusedTodaySec = 0; }
    dnd.focusedTodaySec += 1;
    saveJSON("tws-dnd", dnd);
    if (el.dndCounter) el.dndCounter.textContent = fmtHMS(dnd.focusedTodaySec);
  }
  function startDND(){
    dnd.running = true; dnd.startedAt = new Date().toISOString(); dnd.date = dateKey(new Date());
    saveJSON("tws-dnd", dnd);
    if (!dndInterval) dndInterval = setInterval(tickDND, 1000);
    if (el.dndCounter) el.dndCounter.textContent = fmtHMS(dnd.focusedTodaySec);
  }
  function stopDND(){
    dnd.running = false; saveJSON("tws-dnd", dnd);
  }
  if (el.dndSwitch) el.dndSwitch.addEventListener("change", () => { el.dndSwitch.checked ? startDND() : stopDND(); });

  // Goals events
  function renderImpact(){
    if (!el.impactSummary) return;
    const now = new Date();
    let completed7 = 0;
    for (let i=0;i<7;i++){
      const d = new Date(); d.setDate(now.getDate()-i);
      const list = loadTasks(d);
      completed7 += list.filter(t=>t.done).length;
    }
    const avg = (completed7/7).toFixed(1);
    el.impactSummary.textContent = goals.length
      ? `Con ${avg} tareas/día, impulsarás ${goals.length} objetivos. Manteniéndolo por 4 semanas: ${(avg*28).toFixed(0)} tareas totales.`
      : `Con ${avg} tareas/día, mantén el ritmo por 4 semanas para ver progreso sostenido.`;
  }
  function saveGoalsHandler(){
    const raw = (el.goalsInput?.value || "").trim();
    goals = raw ? raw.split(",").map(s=>s.trim()).filter(Boolean) : [];
    saveJSON("tws-goals", goals);
    renderImpact();
  }
  if (el.saveGoals) el.saveGoals.addEventListener("click", saveGoalsHandler);

  // Partner events
  function renderCheckIns(){
    if (!el.checkInList) return;
    el.checkInList.innerHTML = "";
    partner.checkIns.slice().reverse().forEach(d=>{
      const li = document.createElement("li"); li.textContent = new Date(d).toLocaleDateString(); el.checkInList.appendChild(li);
    });
  }
  function pairPartnerHandler(){
    partner.name = (el.partnerName?.value || "").trim(); saveJSON("tws-partner", partner);
  }
  function checkInHandler(){
    partner.checkIns.push(new Date().toISOString());
    saveJSON("tws-partner", partner);
    renderCheckIns();
  }
  if (el.pairPartner) el.pairPartner.addEventListener("click", pairPartnerHandler);
  if (el.checkInBtn) el.checkInBtn.addEventListener("click", checkInHandler);

  setSelectedLabel(selected);
  renderTasks();
  renderCalendar();
  syncPomodoroInputs();
  updateGamificationUI();
  updateAnalyticsUI();
  loadJournalForSelected();
  renderCommitments();
  renderTechniques();
  loadEnergyForSelected();
  // Initialize 9-12
  if (el.dndSwitch) el.dndSwitch.checked = !!dnd.running;
  if (!dndInterval) dndInterval = setInterval(tickDND, 1000);
  if (el.dndCounter) el.dndCounter.textContent = fmtHMS(dnd.focusedTodaySec || 0);
  if (el.goalsInput) el.goalsInput.value = goals.join(", ");
  renderImpact();
  renderCheckIns();
  // Initialize 13-16
  renderMicroHabits();
  computeRewards();
  renderRewards();
  fillHabitChainSelect();
  renderHabitChain();
  refreshBreakdownTaskOptions();
  // Initialize 17-20
  const bioToday = bioLog[dateKey(selected)]; if (bioToday) renderBioAdvice(bioToday.stress, bioToday.fatigue);
  renderNarratives();
  renderChallengeProgress();
  refreshSynergies();

})();
