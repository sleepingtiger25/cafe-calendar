/**
 * Supabase へサンプルイベントデータを投入するスクリプト
 * 
 * 使用方法:
 * 1. .env.local を確認
 * 2. Node.js で実行: node seed-data.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません。.env.local を確認してください。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// サンプルイベント
const sampleEvents = [
  {
    title: '春の新メニュー発表会',
    description: '春を彩る新しいメニューをご紹介します。\nシェフが厳選した食材を使った限定メニューです。\nぜひこの機会にお試しください！',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    event_date: '2024-04-15',
    start_time: '11:00:00',
    end_time: '20:00:00',
    link_url: 'https://example.com/spring-menu',
    popup_image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    is_published: true
  },
  {
    title: 'ゴールデンウィーク営業のお知らせ',
    description: 'ゴールデンウィーク期間中の営業スケジュール\n\n4/27（土）-5/5（日）:\n  営業時間 10:00-19:00\n\n5/6（月）:\n  定休日',
    image_url: 'https://images.unsplash.com/photo-1570521944256-e7a06ee3e8c1?w=800&h=600&fit=crop',
    event_date: '2024-04-20',
    start_time: null,
    end_time: null,
    link_url: null,
    popup_image_url: null,
    is_published: true
  },
  {
    title: '夏のカフェイベント「涼白麺フェスタ」',
    description: '夏の暑さを吹き飛ばす、冷たい白ダシ麺の祭典！\n\n期間限定メニュー:\n・冷白麺 ~夏野菜~\n・冷白麺 ~フルーツ~\n・冷白スムージー\n\nご来店お待ちしています！',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    event_date: '2024-07-01',
    start_time: '10:00:00',
    end_time: '21:00:00',
    link_url: 'https://example.com/summer-event',
    popup_image_url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
    is_published: true
  },
  {
    title: '秋の限定チーズケーキ登場',
    description: '季節のチーズケーキが新登場！\n\n栗とマロンの深い味わい、\nシナモンの香りが秋の訪れを感じさせます。\n\n数量限定なのでお早めに！',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    event_date: '2024-09-15',
    start_time: null,
    end_time: null,
    link_url: null,
    popup_image_url: null,
    is_published: true
  },
  {
    title: '冬季休業のお知らせ',
    description: '年末年始の営業スケジュール\n\n12/25（水）-12/31（火）: 通常営業\n1/1（水）-1/3（金）: 冬季休業\n1/4（土）: 営業再開\n\nご迷惑をおかけします。',
    image_url: null,
    event_date: '2024-12-20',
    start_time: null,
    end_time: null,
    link_url: null,
    popup_image_url: null,
    is_published: true
  }
];

async function seedData() {
  try {
    console.log('📝 サンプルデータを投入中...\n');

    // 既存のイベントを確認
    const { data: existingEvents, error: fetchError } = await supabase
      .from('events')
      .select('id');

    if (fetchError) {
      console.error('❌ 既存データの確認に失敗:', fetchError.message);
      process.exit(1);
    }

    if (existingEvents && existingEvents.length > 0) {
      console.log(`⚠️  既に ${existingEvents.length} 件のイベントが存在します`);
      console.log('🗑️  既存データを削除します...');

      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // すべて削除

      if (deleteError) {
        console.error('❌ 削除に失敗:', deleteError.message);
        process.exit(1);
      }
      console.log('✅ 既存データを削除しました\n');
    }

    // サンプルデータを挿入
    const { error: insertError } = await supabase
      .from('events')
      .insert(sampleEvents);

    if (insertError) {
      console.error('❌ データ投入に失敗:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ ${sampleEvents.length} 件のイベントを投入しました\n`);

    // 投入結果を確認
    const { data: allEvents } = await supabase
      .from('events')
      .select('id, title, event_date, is_published')
      .order('event_date', { ascending: true });

    if (allEvents) {
      console.log('📋 投入されたイベント:');
      allEvents.forEach((event, index) => {
        const status = event.is_published ? '🌐' : '📝';
        console.log(`  ${index + 1}. ${status} ${event.title} (${event.event_date})`);
      });
    }

    console.log('\n✨ セットアップ完了！');
    console.log('👉 ブラウザを開いて http://localhost:5173 にアクセス\n');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

seedData();
