document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('team-data-dialog');
    const openBtn = document.getElementById('open-team-dialog-btn');
    const rosterRowsContainer = document.getElementById('roster-rows');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const dataSaveBtn = document.getElementById('data-save-btn');
    const dataLoadBtn = document.getElementById('data-load-btn');
    const teamNameInput = document.getElementById('team-name-input');

    // 添付されたJSONデータ（初期表示用またはLoadのサンプル）
    const initialJsonData = {
      "id": "team-1786956457072",
      "teamName": "OMBBC 50",
      "members": [
        { "id": "rm-1786956460744", "name": "三沢 和清", "number": "55" },
        { "id": "rm-1786956471552", "name": "矢野 浩敏", "number": "10" },
        { "id": "rm-1786956480457", "name": "山本 忠", "number": "11" },
        { "id": "rm-1786956489330", "name": "小湊 潮", "number": "17" },
        { "id": "rm-1786956498363", "name": "川本 弘一", "number": "18" },
        { "id": "rm-1786956507563", "name": "末廣 正雄", "number": "33" },
        { "id": "rm-1786956518821", "name": "川勝 哲也", "number": "36" },
        { "id": "rm-1786956528923", "name": "山口 晋一", "number": "88" },
        { "id": "rm-1786956538637", "name": "庄司 光秀", "number": "91" }
      ]
    };

    let currentTeamId = initialJsonData.id;

    // ダイアログを開く
    openBtn.addEventListener('click', () => {
        loadDataToForm(initialJsonData);
        dialog.showModal();
    });

    // 1行分のHTML要素を作成する関数
    function createPlayerRow(number = '', name = '', id = '') {
        const row = document.createElement('div');
        row.className = 'roster-row';
        row.dataset.id = id || ('rm-' + Date.now() + Math.floor(Math.random()*1000));
        
        row.innerHTML = `
            <input type="text" class="player-number" value="${number}" placeholder="背番号">
            <input type="text" class="player-name" value="${name}" placeholder="選手名">
            <button type="button" class="delete-btn">削除</button>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            row.remove();
        });

        return row;
    }

    // フォームにデータをロードして12人分（またはそれ以上）に調整する
    function loadDataToForm(data) {
        teamNameInput.value = data.teamName || '';
        currentTeamId = data.id || ('team-' + Date.now());
        rosterRowsContainer.innerHTML = '';

        // 既存メンバーを追加
        const members = data.members || [];
        members.forEach(member => {
            rosterRowsContainer.appendChild(createPlayerRow(member.number, member.name, member.id));
        });

        // 12人分に満たない場合は空の行を追加して計12行にする
        const shortage = 12 - rosterRowsContainer.children.length;
        for (let i = 0; i < shortage; i++) {
            rosterRowsContainer.appendChild(createPlayerRow());
        }
    }

    // 選手追加ボタン
    addPlayerBtn.addEventListener('click', () => {
        rosterRowsContainer.appendChild(createPlayerRow());
    });

    // DataSaveボタン（JSON形式でコンソール出力＆ファイルダウンロード）
    dataSaveBtn.addEventListener('click', () => {
        const rows = rosterRowsContainer.querySelectorAll('.roster-row');
        const members = [];

        rows.forEach(row => {
            const number = row.querySelector('.player-number').value.trim();
            const name = row.querySelector('.player-name').value.trim();
            const id = row.dataset.id;

            // 背番号または名前が入力されている場合のみ保存対象にする
            if (number !== '' || name !== '') {
                members.push({ id, name, number });
            }
        });

        const outputData = {
            id: currentTeamId,
            teamName: teamNameInput.value.trim(),
            members: members
        };

        console.log("Saved JSON:", JSON.stringify(outputData, null, 2));

        // ファイルとしてダウンロードさせる処理
        const blob = new Blob([JSON.stringify(outputData, null, 2)], { type: 'json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statstoo_roster_${outputData.teamName || 'team'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('データを保存（JSONダウンロード）しました。');
    });


    // DataLoadボタン：ファイル選択ダイアログを開く
    const fileSelector = document.getElementById('file-selector');

    dataLoadBtn.addEventListener('click', () => {
        fileSelector.click();
    });

    // ファイルが選択された時の処理
    fileSelector.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                // 読み込んだデータをフォームに反映
                loadDataToForm(loadedData);
                alert('ファイルを読み込みました。');
            } catch (err) {
                alert('JSONファイルの読み込みに失敗しました。正しいファイルか確認してください。');
            }
        };
        reader.readAsText(file);
    });
});