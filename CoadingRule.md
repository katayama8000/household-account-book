## 命名
- テーブル名は複数形
- 関数名は動詞+名詞(テーブル名)+その他の情報
- DBから値を取得する関数名は`fetch`をつける
    - 例: `fetchUser`
- テーブルのデータをすべて取得する場合
    - テーブル名は複数形
    - テーブル名の後ろに`All`をつける
    - 例: `fetchUsersAll`
- キーを使って取得する場合は`By`をつける
    - 例: `fetchUserById`
