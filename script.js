const TIME_LIMIT = 20; // 遊戲時間限制 (秒)
const WINNING_DISTANCE = 100; // 達到 100% 視為勝利

const timeDisplay = document.getElementById('time');
const paddleButton = document.getElementById('paddle-button');
const playerProgressDiv = document.getElementById('player-progress');
const computerProgressDiv = document.getElementById('computer-progress');
// 修正：指向新的獨立 Div 元素
const playerClicksDiv = document.getElementById('player-clicks'); 
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');

let timeLeft = TIME_LIMIT;
let playerDistance = 0; // 玩家累積距離 (0-100)
let computerDistance = 0; // 電腦累積距離 (0-100)
let clickCount = 0; // 玩家實際點擊次數
let gameTimer;

// --- 遊戲核心邏輯 ---

/**
 * 處理玩家點擊划槳按鈕
 */
function handlePaddle() {
    if (timeLeft <= 0) return; 

    // 1. 增加玩家距離
    const progressPerClick = 1; // 每次點擊前進 1%
    playerDistance += progressPerClick;
    clickCount++;
    
    // 2. 限制最大距離為 100
    playerDistance = Math.min(playerDistance, WINNING_DISTANCE);

    // 3. 更新畫面
    updateDisplay();
    
    // 4. 檢查是否提前獲勝
    if (playerDistance >= WINNING_DISTANCE) {
        endGame('win');
    }
}

/**
 * 處理電腦對手的自動前進
 */
function runComputer() {
    // 電腦每秒前進 3% - 6% (模擬隨機划槳速度)
    const minProgress = 3; 
    const maxProgress = 6;
    const progress = Math.random() * (maxProgress - minProgress) + minProgress;
    
    computerDistance += progress;
    computerDistance = Math.min(computerDistance, WINNING_DISTANCE);
    
    updateDisplay();
}

/**
 * 更新所有畫面顯示 (進度條和計數)
 */
function updateDisplay() {
    // 更新進度條寬度
    playerProgressDiv.style.width = `${playerDistance}%`;
    computerProgressDiv.style.width = `${computerDistance}%`;

    // 修正：更新獨立的 Div 元素
    playerClicksDiv.textContent = `划槳次數: ${clickCount}`;
    
    // 更新時間顯示
    timeDisplay.textContent = timeLeft;
}

/**
 * 啟動計時器
 */
function startTimer() {
    timeLeft = TIME_LIMIT;
    updateDisplay(); 

    // 清除舊的計時器
    if (gameTimer) clearInterval(gameTimer);

    // 每 1000 毫秒 (1 秒) 執行一次
    gameTimer = setInterval(() => {
        timeLeft--;

        runComputer();

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            endGame('timeup'); 
        }
        
        timeDisplay.textContent = Math.max(0, timeLeft);

    }, 1000);
}

/**
 * 遊戲結束流程
 * @param {string} reason - 'win', 'lose', or 'timeup'
 */
function endGame(reason) {
    clearInterval(gameTimer); 
    paddleButton.removeEventListener('click', handlePaddle); 
    paddleButton.disabled = true;

    overlay.classList.add('visible'); 

    if (reason === 'win') {
        resultTitle.textContent = '🥇 玩家獲勝！';
        resultMessage.textContent = `恭喜你率先衝過終點線！共划槳 ${clickCount} 次。`;
    } else if (playerDistance > computerDistance) {
        resultTitle.textContent = '🏆 時間到，玩家領先！';
        resultMessage.textContent = `你在 ${TIME_LIMIT} 秒內划行了 ${Math.round(playerDistance)}% 的距離，戰勝了電腦！`;
    } else {
        resultTitle.textContent = '😭 挑戰失敗！';
        resultMessage.textContent = `電腦龍舟更勝一籌，你在 ${TIME_LIMIT} 秒內划行了 ${Math.round(playerDistance)}% 的距離。再試一次吧！`;
    }
}


/**
 * 遊戲初始化
 */
window.startGame = function() {
    // 重設狀態
    timeLeft = TIME_LIMIT;
    playerDistance = 0;
    computerDistance = 0;
    clickCount = 0;

    // 清除舊的計時器
    if (gameTimer) clearInterval(gameTimer);

    // 隱藏結果畫面
    overlay.classList.remove('visible'); 
    
    // 啟用按鈕並綁定事件
    paddleButton.disabled = false;
    paddleButton.removeEventListener('click', handlePaddle); 
    paddleButton.addEventListener('click', handlePaddle);

    // 啟動遊戲
    updateDisplay();
    startTimer();
}

// 網頁載入後自動開始遊戲
window.onload = startGame;