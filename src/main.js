var conversationHistory = [];
    var apiKey, userName;
    var currentStage = '';
    var gameEnded = false; // 用來追踪遊戲是否結束

    function promptForDetails() {
        apiKey = prompt("請輸入你的API金鑰:", "");
        userName = prompt("請輸入你的名字:", "");

        if (!apiKey || !userName) {
            alert("必須輸入API金鑰和名字才能使用此聊天室。");
            return false;
        }
        alert("歡迎, " + userName + "!");
        return true;
    }

    function setupEventListeners() {
        document.getElementById('messageForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('introButton').addEventListener('click', showIntro);
        document.getElementById('startButton').addEventListener('click', startGame);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        if (gameEnded) return; // 若遊戲已結束，停止處理表單提交

        var inputElement = document.getElementById('messageInput');
        var message = inputElement.value.trim();
        if (!message) return;

        addToConversationHistory('user', message);
        displayMessage(message, 'user');
        inputElement.value = '';

        handleUserChoice(currentStage + '-' + message);
    }

    function addToConversationHistory(role, text) {
        conversationHistory.push({
            role: role,
            parts: [{ text: text }]
        });
    }

    function displayMessage(message, sender) {
        var messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'userMessage' : 'botMessage');
        document.getElementById('messages').appendChild(messageElement);

        function typeText(element, text, index) {
            if (index < text.length) {
                let char = text[index];
                if (char === '<') {
                    let endIndex = text.indexOf('>', index);
                    if (endIndex !== -1) {
                        element.innerHTML += text.substring(index, endIndex + 1);
                        index = endIndex + 1;
                    }
                } else {
                    element.innerHTML += char;
                    index++;
                }
                setTimeout(() => typeText(element, text, index), 75);
            } else {
                document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
            }
        }

        typeText(messageElement, formatText(message), 0);
    }

    function updateImg(imageUrl) {
        // document.getElementById('backgroundWrapper').style.backgroundImage = `url(${imageUrl})`;
        document.getElementById('bgImg').setAttribute('src', imageUrl);
    }

    function formatText(text) {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>')
            .replace(/\*(.*?)\s/g, '<br>$1');
        return formattedText;
    }

    function showIntro() {
        document.getElementById('introBlock').style.display = 'block';
    }

    function startGame() {
        if (promptForDetails()) {
            document.getElementById('introBlock').style.display = 'none';
            document.getElementById('introButton').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            startStory();
        }
    }

    function startStory() {
        let initialStory = `你是一位勇敢的勇者，站在一個神秘的洞穴入口前。你的任務是找到失落的寶藏，並帶回傳說中的魔法寶石。你面前有兩條路：
        **1. 進入洞穴探索。**
        **2. 繞過洞穴，進入附近的森林。**
        請選擇（輸入1或2）：`;
        currentStage = 'start';
        addToConversationHistory('model', initialStory);
        displayMessage(initialStory, 'bot');
    }

    function handleUserChoice(choice) {
        let responseText;

        switch (choice) {
            case 'start-1':
                responseText = `你進入了洞穴，發現裡面光線昏暗，四周都是濕滑的石壁。突然，你聽到一聲怪物的吼叫聲：
                **1. 選擇戰鬥。**
                **2. 選擇逃跑。**
                請選擇（輸入1或2）：`;
                currentStage = '1';
                updateImg('./img/1.png');
                break;

            case 'start-2':
                responseText = `你選擇繞過洞穴，進入了附近的森林。森林裡樹木茂密，光線昏暗。你在前進的路上遇到了一位神秘的老人：
                **1. 交談。**
                **2. 忽略。**
                請選擇（輸入1或2）：`;
                currentStage = '2';
                updateImg('./img/2.png');
                break;

            case '1-1':
                responseText = `你打敗了怪物，繼續探索洞穴，發現了一個寶箱。打開後你找到了魔法寶石，你成功完成了任務，成為了傳說中的英雄！`;
                updateImg('./img/3.png');
                endGame(responseText);
                break;

            case '1-2':
                responseText = `你選擇了逃跑，但在逃跑的過程中不慎跌入深淵，你的冒險結束了，但你的勇氣將永遠被人們銘記。`;
                updateImg('./img/4.png');
                endGame(responseText);
                break;

            case '2-1':
                responseText = `神秘的老人給你一張寶藏地圖，指引你前往一個隱藏的洞穴。你遵循地圖的指引，最終找到了寶藏，成為了傳說中的英雄！`;
                updateImg('./img/5.png')  ;
                endGame(responseText);
                break;

            case '2-2':
                responseText = `你選擇忽略老人，但在森林中迷失了方向。最終你找到了出路，但未能完成任務，然而你的勇氣和智慧將被人們銘記。`;
                updateImg('./img/6.png');
                endGame(responseText);
                break;

            default:
                responseText = `請選擇有效的選項（輸入1或2）：`;
        }

        addToConversationHistory('model', responseText);
        displayMessage(responseText, 'bot');
    }

    function endGame() {
        if (!gameEnded) {
            displayMessage(finalMessage, 'bot');
            gameEnded = true; // 設定遊戲結束標識
            document.getElementById('messageInput').disabled = true;
        }
    }

    setupEventListeners();