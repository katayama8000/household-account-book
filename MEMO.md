## DB を操作して、月締めをする場合
- https://supabase.com/dashboard/project/jqovxmsueffhddmyqcew/editor/17727?schema=public にアクセス
- `monthly_invoices` テーブルを開く
- 今月分の新しいレコードを追加    
- 作ったレコードの前月のレコードの`is_paid`を`true`にする
- 作ったレコードの前月のレコードの`active`を`false`にする
- アプリからいつもは自動追加しているレコードを追加する
    - ガソリン
    - 通信費
    - 家賃

