export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'ru' | 'it' | 'es' | 'pt' | 'ar';

export interface Translations {
  // App title and description
  appTitle: string;
  appDescription: string;
  
  // Tab titles and tooltips
  tabs: {
    linkPreview: {
      title: string;
      tooltip: string;
    };
    dragText: {
      title: string;
      tooltip: string;
    };
    other: {
      title: string;
      tooltip: string;
    };
  };
  
  // Link Preview settings
  linkPreview: {
    title: string;
    enableLabel: string;
    enableDescription: string;
    triggerMethods: {
      drag: string;
      hover: string;
      longPress: string;
      customHover: string;
      disabled: string;
    };
    shortcutKeyLabel: string;
    shortcutKeys: {
      alt: string;
      cmd: string;
      shift: string;
    };
    clickText: string;
    hoverText: string;
    popupSizeLabel: string;
    popupSizes: Record<string, string>;
    popupPositionLabel: string;
    popupPositions: Record<string, string>;
    themeLabel: string;
    themes?: Record<string, string>;
    opacityLabel: string;
    positionLabel?: string;
    positionDescription?: string;
    positions?: Record<string, string>;
    delayLabel: string;
    delayDescription?: string;
    longPressDelayLabel: string;
    longPressDelayDescription?: string;
    sizeLabel: string;
    sizeDescription?: string;
    sizes?: Record<string, string>;
  };
  
  // Drag Text settings
  dragText: {
    title: string;
    searchEngineLabel: string;
    searchEngines: {
      bing: string;
      google: string;
      baidu: string;
      duckduckgo: string;
    };
    enableLabel: string;
    enableDescription: string;
    maxLengthLabel: string;
    maxLengthDescription: string;
    customTextLabel: string;
    customTextDescription: string;
    customTextPlaceholder: string;
    disabledSitesLabel: string;
    disabledSitesDescription: string;
    disabledSitesPlaceholder: string;
    domainFormatHint: string;
    domainCountHint: string;
    invalidDomains: string;
    exceedsLimitError: string;
  };
  
  // Other settings
  other: {
    title: string;
    themeLabel: string;
    themeDescription: string;
    themes: {
      system: string;
      light: string;
      dark: string;
    };
    languageLabel: string;
    languageDescription: string;
    languages: {
      'zh-CN': string;
      'zh-TW': string;
      'en': string;
      'ja': string;
      'ko': string;
      'fr': string;
      'de': string;
      'ru': string;
      'it': string;
      'es': string;
      'pt': string;
      'ar': string;
    };
    reloadNote: string;
  };
  
  // Common
  common: {
    enabled: string;
    disabled: string;
    save: string;
    cancel: string;
    reset: string;
  };
}

export const translations: Record<Language, Translations> = {
  'zh-CN': {
    appTitle: '悬停链接预览',
    appDescription: '鼠标悬停时显示链接预览',
    
    tabs: {
      linkPreview: {
        title: '链接预览',
        tooltip: '配置链接预览功能'
      },
      dragText: {
        title: '拖拽文本',
        tooltip: '配置文本拖拽功能'
      },
      other: {
        title: '其他设置',
        tooltip: '其他配置选项'
      }
    },
    
    linkPreview: {
      title: '链接预览设置',
      enableLabel: '启用链接预览',
      enableDescription: '鼠标悬停在链接上时显示预览',

      triggerMethods: {
        drag: '拖动链接',
        hover: '鼠标悬停',
        longPress: '长按链接',

        customHover: '自定义快捷键+悬停',
        disabled: '禁用'
      },
      shortcutKeyLabel: '快捷键',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: '点击',
      hoverText: '悬停',
      popupSizeLabel: '弹窗大小',
      popupSizes: {
        lastSize: '上次大小',
        defaultSize: '默认大小',
        contentAdaptive: '内容自适应',
        last: '上次大小',
        small: '小',
        medium: '中',
        large: '大'
      },
      popupPositionLabel: '弹窗位置',
      popupPositions: {
        followMouse: '跟随鼠标',
        center: '屏幕居中',
        topRight: '屏幕右上角',
        last: '上次位置',
        left: '屏幕左侧',
        right: '屏幕右侧'
      },
      themeLabel: '弹窗主题',
      opacityLabel: '背景透明度',
      positionLabel: '预览位置',
      positionDescription: '选择预览窗口显示的位置',
      positions: {
        topLeft: '左上角',
        topRight: '右上角',
        bottomLeft: '左下角',
        bottomRight: '右下角'
      },
      delayLabel: '显示延迟',
      delayDescription: '鼠标悬停后多久显示预览（毫秒）',
      longPressDelayLabel: '长按延迟',
      longPressDelayDescription: '长按链接多久后显示预览（毫秒）',
      sizeLabel: '预览大小',
      sizeDescription: '选择预览窗口的大小',
      sizes: {
        small: '小',
        medium: '中',
        large: '大'
      }
    },
    
    dragText: {
      title: '拖拽文本设置',
      searchEngineLabel: '搜索引擎',
      searchEngines: {
        bing: '必应搜索',
        google: '谷歌搜索',
        baidu: '百度搜索',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: '启用拖拽文本',
      enableDescription: '允许拖拽选中的文本',
      maxLengthLabel: '最大长度',
      maxLengthDescription: '拖拽文本的最大字符数',
      customTextLabel: '自定义文本',
      customTextDescription: '设置拖拽时显示的自定义文本内容',
      customTextPlaceholder: '输入自定义文本内容...',
      disabledSitesLabel: '禁用网站',
      disabledSitesDescription: '管理禁用拖拽文本功能的网站列表',
      disabledSitesPlaceholder: '每行输入一个域名\n示例：\nexample.com\nwww.google.com',
      domainFormatHint: '支持一级域名（example.com）和二级域名（www.example.com）',
      domainCountHint: '当前域名数量：{count}/10',
      invalidDomains: '无效的域名格式',
      exceedsLimitError: '最多只能添加10个域名'
    },
    
    other: {
      title: '其他设置',
      themeLabel: '主题设置',
      themeDescription: '选择应用主题外观',
      themes: {
        system: '跟随系统',
        light: '浅色',
        dark: '深色'
      },
      languageLabel: '界面语言',
      languageDescription: '选择界面显示语言',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: '语言更改后需要重新加载扩展才能生效'
    },
    
    common: {
      enabled: '已启用',
      disabled: '已禁用',
      save: '保存',
      cancel: '取消',
      reset: '重置'
    }
  },

  'zh-TW': {
    appTitle: '懸停連結預覽',
    appDescription: '滑鼠懸停時顯示連結預覽',
    
    tabs: {
      linkPreview: {
        title: '連結預覽',
        tooltip: '配置連結預覽功能'
      },
      dragText: {
        title: '拖曳文字',
        tooltip: '配置文字拖曳功能'
      },
      other: {
        title: '其他設定',
        tooltip: '其他配置選項'
      }
    },
    
    linkPreview: {
      title: '連結預覽設定',
      enableLabel: '啟用連結預覽',
      enableDescription: '滑鼠懸停在連結上時顯示預覽',

      triggerMethods: {
        drag: '拖動連結',
        hover: '滑鼠懸停',
        longPress: '長按連結',

        customHover: '自訂快捷鍵+懸停',
        disabled: '停用'
      },
      shortcutKeyLabel: '快捷鍵',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: '點擊',
      hoverText: '懸停',
      popupSizeLabel: '彈窗大小',
      popupSizes: {
        lastSize: '上次大小',
        defaultSize: '預設大小',
        contentAdaptive: '內容自適應',
        last: '上次大小',
        small: '小',
        medium: '中',
        large: '大'
      },
      popupPositionLabel: '彈窗位置',
      popupPositions: {
        followMouse: '跟隨滑鼠',
        center: '螢幕居中',
        topRight: '螢幕右上角',
        last: '上次位置',
        left: '螢幕左側',
        right: '螢幕右側'
      },
      themeLabel: '彈窗主題',
      opacityLabel: '背景透明度',
      positionLabel: '預覽位置',
      positionDescription: '選擇預覽視窗顯示的位置',
      positions: {
        topLeft: '左上角',
        topRight: '右上角',
        bottomLeft: '左下角',
        bottomRight: '右下角'
      },
      delayLabel: '顯示延遲',
      delayDescription: '滑鼠懸停後多久顯示預覽（毫秒）',
      longPressDelayLabel: '長按延遲',
      longPressDelayDescription: '長按連結多久後顯示預覽（毫秒）',
      sizeLabel: '預覽大小',
      sizeDescription: '選擇預覽視窗的大小',
      sizes: {
        small: '小',
        medium: '中',
        large: '大'
      }
    },
    
    dragText: {
      title: '拖曳文字設定',
      searchEngineLabel: '搜尋引擎',
      searchEngines: {
        bing: 'Bing搜尋',
        google: 'Google搜尋',
        baidu: '百度搜尋',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: '啟用拖曳文字',
      enableDescription: '允許拖曳選中的文字',
      maxLengthLabel: '最大長度',
      maxLengthDescription: '拖曳文字的最大字元數',
      customTextLabel: '自訂文字',
      customTextDescription: '設定拖曳時顯示的自訂文字內容',
      customTextPlaceholder: '輸入自訂文字內容...',
      disabledSitesLabel: '禁用網站',
      disabledSitesDescription: '管理禁用拖曳文字功能的網站列表',
      disabledSitesPlaceholder: '每行輸入一個域名\n範例：\nexample.com\nwww.google.com',
      domainFormatHint: '支援一級域名（example.com）和二級域名（www.example.com）',
      domainCountHint: '目前域名數量：{count}/10',
      invalidDomains: '無效的域名格式',
      exceedsLimitError: '最多只能新增10個域名'
    },
    
    other: {
      title: '其他設定',
      themeLabel: '主題設定',
      themeDescription: '選擇應用程式主題外觀',
      themes: {
        system: '跟隨系統',
        light: '淺色',
        dark: '深色'
      },
      languageLabel: '介面語言',
      languageDescription: '選擇介面顯示語言',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: '語言更改後需要重新載入擴充功能才能生效'
    },
    
    common: {
      enabled: '已啟用',
      disabled: '已停用',
      save: '儲存',
      cancel: '取消',
      reset: '重設'
    }
  },

  'en': {
    appTitle: 'Hover Link Preview',
    appDescription: 'Show link preview on hover',
    
    tabs: {
      linkPreview: {
        title: 'Link Preview',
        tooltip: 'Configure link preview settings'
      },
      dragText: {
        title: 'Drag Text',
        tooltip: 'Configure text dragging settings'
      },
      other: {
        title: 'Other Settings',
        tooltip: 'Other configuration options'
      }
    },
    
    linkPreview: {
      title: 'Link Preview Settings',
      enableLabel: 'Enable Link Preview',
      enableDescription: 'Show preview when hovering over links',

      triggerMethods: {
        drag: 'Drag Link',
        hover: 'Mouse Hover',
        longPress: 'Long Press Link',

        customHover: 'Custom Key+Hover',
        disabled: 'Disabled'
      },
      shortcutKeyLabel: 'Shortcut Key',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: 'Click',
      hoverText: 'Hover',
      popupSizeLabel: 'Popup Size',
      popupSizes: {
        lastSize: 'Last Size',
        defaultSize: 'Default Size',
        contentAdaptive: 'Content Adaptive',
        last: 'Last Size',
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      },
      popupPositionLabel: 'Popup Position',
      popupPositions: {
        followMouse: 'Follow Mouse',
        center: 'Screen Center',
        topRight: 'Top Right Corner',
        last: 'Last Position',
        left: 'Left Side',
        right: 'Right Side'
      },
      themeLabel: 'Popup Theme',
      opacityLabel: 'Background Opacity',
      positionLabel: 'Preview Position',
      positionDescription: 'Choose where the preview window appears',
      positions: {
        topLeft: 'Top Left',
        topRight: 'Top Right',
        bottomLeft: 'Bottom Left',
        bottomRight: 'Bottom Right'
      },
      delayLabel: 'Display Delay',
      delayDescription: 'How long to wait before showing preview (milliseconds)',
      longPressDelayLabel: 'Long Press Delay',
      longPressDelayDescription: 'How long to press link before showing preview (milliseconds)',
      sizeLabel: 'Preview Size',
      sizeDescription: 'Choose the size of the preview window',
      sizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      }
    },
    
    dragText: {
      title: 'Drag Text Settings',
      searchEngineLabel: 'Search Engine',
      searchEngines: {
        bing: 'Bing Search',
        google: 'Google Search',
        baidu: 'Baidu Search',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'Enable Drag Text',
      enableDescription: 'Allow dragging selected text',
      maxLengthLabel: 'Max Length',
      maxLengthDescription: 'Maximum number of characters for dragged text',
      customTextLabel: 'Custom Text',
      customTextDescription: 'Set custom text content to display when dragging',
      customTextPlaceholder: 'Enter custom text content...',
      disabledSitesLabel: 'Blocked Websites',
      disabledSitesDescription: 'Manage the list of websites where drag text functionality is disabled',
      disabledSitesPlaceholder: 'Enter domain names, one per line\nExample:\nexample.com\nwww.google.com',
      domainFormatHint: 'Supports primary domains (example.com) and subdomains (www.example.com)',
      domainCountHint: 'Current domains: {count}/10',
      invalidDomains: 'Invalid domain format',
      exceedsLimitError: 'Maximum 10 domains allowed'
    },
    
    other: {
      title: 'Other Settings',
      themeLabel: 'Theme Settings',
      themeDescription: 'Choose application theme appearance',
      themes: {
        system: 'Follow System',
        light: 'Light',
        dark: 'Dark'
      },
      languageLabel: 'Interface Language',
      languageDescription: 'Select interface display language',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: 'Extension needs to be reloaded after language change'
    },
    
    common: {
      enabled: 'Enabled',
      disabled: 'Disabled',
      save: 'Save',
      cancel: 'Cancel',
      reset: 'Reset'
    }
  },

  'ja': {
    appTitle: 'ホバーリンクプレビュー',
    appDescription: 'ホバー時にリンクプレビューを表示',
    
    tabs: {
      linkPreview: {
        title: 'リンクプレビュー',
        tooltip: 'リンクプレビュー設定を構成'
      },
      dragText: {
        title: 'テキストドラッグ',
        tooltip: 'テキストドラッグ設定を構成'
      },
      other: {
        title: 'その他の設定',
        tooltip: 'その他の設定オプション'
      }
    },
    
    linkPreview: {
      title: 'リンクプレビュー設定',
      enableLabel: 'リンクプレビューを有効にする',
      enableDescription: 'リンクにホバーした時にプレビューを表示',

      triggerMethods: {
        drag: 'リンクをドラッグ',
        hover: 'マウスホバー',
        longPress: 'リンク長押し',

        customHover: 'カスタムキー+ホバー',
        disabled: '無効'
      },
      shortcutKeyLabel: 'ショートカットキー',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: 'クリック',
      hoverText: 'ホバー',
      popupSizeLabel: 'ポップアップサイズ',
      popupSizes: {
        lastSize: '前回のサイズ',
        defaultSize: 'デフォルトサイズ',
        contentAdaptive: 'コンテンツ適応',
        last: '前回のサイズ',
        small: '小',
        medium: '中',
        large: '大'
      },
      popupPositionLabel: 'ポップアップ位置',
      popupPositions: {
        followMouse: 'マウスに追従',
        center: '画面中央',
        topRight: '右上角',
        last: '前回の位置',
        left: '画面左側',
        right: '画面右側'
      },
      themeLabel: 'ポップアップテーマ',
      themes: {
        light: 'ライト',
        dark: 'ダーク',
        blue: 'ブルー',
        red: 'レッド',
        yellow: 'イエロー',
        green: 'グリーン'
      },
      opacityLabel: '背景透明度',
      positionLabel: 'プレビュー位置',
      positionDescription: 'プレビューウィンドウの表示位置を選択',
      positions: {
        topLeft: '左上',
        topRight: '右上',
        bottomLeft: '左下',
        bottomRight: '右下'
      },
      delayLabel: '表示遅延',
      delayDescription: 'プレビュー表示までの待機時間（ミリ秒）',
      longPressDelayLabel: '長押し遅延',
      longPressDelayDescription: 'リンク長押しからプレビュー表示までの時間（ミリ秒）',
      sizeLabel: 'プレビューサイズ',
      sizeDescription: 'プレビューウィンドウのサイズを選択',
      sizes: {
        small: '小',
        medium: '中',
        large: '大'
      }
    },
    
    dragText: {
      title: 'テキストドラッグ設定',
      searchEngineLabel: '検索エンジン',
      searchEngines: {
        bing: 'Bing検索',
        google: 'Google検索',
        baidu: 'Baidu検索',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'テキストドラッグを有効にする',
      enableDescription: '選択したテキストのドラッグを許可',
      maxLengthLabel: '最大長',
      maxLengthDescription: 'ドラッグテキストの最大文字数',
      customTextLabel: 'カスタムテキスト',
      customTextDescription: 'ドラッグ時に表示するカスタムテキスト内容を設定',
      customTextPlaceholder: 'カスタムテキスト内容を入力...',
      disabledSitesLabel: 'ブロックされたウェブサイト',
      disabledSitesDescription: 'テキストドラッグ機能を無効にするウェブサイトのリストを管理',
      disabledSitesPlaceholder: '1行に1つのドメイン名を入力\n例：\nexample.com\nwww.google.com',
      domainFormatHint: 'プライマリドメイン（example.com）とサブドメイン（www.example.com）をサポート',
      domainCountHint: '現在のドメイン数：{count}/10',
      invalidDomains: '無効なドメイン形式',
      exceedsLimitError: '最大10個のドメインまで許可されています'
    },
    
    other: {
      title: 'その他の設定',
      themeLabel: 'テーマ設定',
      themeDescription: 'アプリケーションテーマの外観を選択',
      themes: {
        system: 'システムに従う',
        light: 'ライト',
        dark: 'ダーク'
      },
      languageLabel: 'インターフェース言語',
      languageDescription: 'インターフェース表示言語を選択',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: '言語変更後は拡張機能の再読み込みが必要です'
    },
    
    common: {
      enabled: '有効',
      disabled: '無効',
      save: '保存',
      cancel: 'キャンセル',
      reset: 'リセット'
    }
  },

  'ko': {
    appTitle: '호버 링크 미리보기',
    appDescription: '호버 시 링크 미리보기 표시',
    
    tabs: {
      linkPreview: {
        title: '링크 미리보기',
        tooltip: '링크 미리보기 설정 구성'
      },
      dragText: {
        title: '텍스트 드래그',
        tooltip: '텍스트 드래그 설정 구성'
      },
      other: {
        title: '기타 설정',
        tooltip: '기타 구성 옵션'
      }
    },
    
    linkPreview: {
      title: '링크 미리보기 설정',
      enableLabel: '링크 미리보기 활성화',
      enableDescription: '링크에 호버할 때 미리보기 표시',

      triggerMethods: {
        drag: '링크 드래그',
        hover: '마우스 호버',
        longPress: '링크 길게 누르기',

        customHover: '사용자 정의 키+호버',
        disabled: '비활성화'
      },
      shortcutKeyLabel: '단축키',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: '클릭',
      hoverText: '호버',
      popupSizeLabel: '팝업 크기',
      popupSizes: {
        lastSize: '마지막 크기',
        defaultSize: '기본 크기',
        contentAdaptive: '콘텐츠 적응',
        last: '마지막 크기',
        small: '작은',
        medium: '중간',
        large: '큰'
      },
      popupPositionLabel: '팝업 위치',
      popupPositions: {
        followMouse: '마우스 따라가기',
        center: '화면 중앙',
        topRight: '오른쪽 위 모서리',
        last: '마지막 위치',
        left: '화면 왼쪽',
        right: '화면 오른쪽'
      },
      themeLabel: '팝업 테마',
      themes: {
        light: '라이트',
        dark: '다크',
        blue: '블루',
        red: '레드',
        yellow: '옐로우',
        green: '그린'
      },
      opacityLabel: '배경 투명도',
      positionLabel: '미리보기 위치',
      positionDescription: '미리보기 창이 나타날 위치 선택',
      positions: {
        topLeft: '왼쪽 위',
        topRight: '오른쪽 위',
        bottomLeft: '왼쪽 아래',
        bottomRight: '오른쪽 아래'
      },
      delayLabel: '표시 지연',
      delayDescription: '미리보기 표시 전 대기 시간(밀리초)',
      longPressDelayLabel: '길게 누르기 지연',
      longPressDelayDescription: '링크를 길게 눌러서 미리보기 표시까지의 시간(밀리초)',
      sizeLabel: '미리보기 크기',
      sizeDescription: '미리보기 창의 크기 선택',
      sizes: {
        small: '작게',
        medium: '보통',
        large: '크게'
      }
    },
    
    dragText: {
      title: '텍스트 드래그 설정',
      searchEngineLabel: '검색 엔진',
      searchEngines: {
        bing: 'Bing 검색',
        google: 'Google 검색',
        baidu: 'Baidu 검색',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: '텍스트 드래그 활성화',
      enableDescription: '선택된 텍스트 드래그 허용',
      maxLengthLabel: '최대 길이',
      maxLengthDescription: '드래그 텍스트의 최대 문자 수',
      customTextLabel: '사용자 정의 텍스트',
      customTextDescription: '드래그 시 표시할 사용자 정의 텍스트 내용 설정',
      customTextPlaceholder: '사용자 정의 텍스트 내용 입력...',
      disabledSitesLabel: '차단된 웹사이트',
      disabledSitesDescription: '텍스트 드래그 기능을 비활성화할 웹사이트 목록 관리',
      disabledSitesPlaceholder: '한 줄에 하나의 도메인 이름 입력\n예시:\nexample.com\nwww.google.com',
      domainFormatHint: '기본 도메인(example.com)과 서브도메인(www.example.com) 지원',
      domainCountHint: '현재 도메인 수: {count}/10',
      invalidDomains: '잘못된 도메인 형식',
      exceedsLimitError: '최대 10개의 도메인만 허용됩니다'
    },
    
    other: {
      title: '기타 설정',
      themeLabel: '테마 설정',
      themeDescription: '애플리케이션 테마 외관 선택',
      themes: {
        system: '시스템 따라가기',
        light: '라이트',
        dark: '다크'
      },
      languageLabel: '인터페이스 언어',
      languageDescription: '인터페이스 표시 언어 선택',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: '언어 변경 후 확장 프로그램을 다시 로드해야 합니다'
    },
    
    common: {
      enabled: '활성화됨',
      disabled: '비활성화됨',
      save: '저장',
      cancel: '취소',
      reset: '재설정'
    }
  },

  'fr': {
    appTitle: 'Aperçu de lien au survol',
    appDescription: 'Afficher l\'aperçu du lien au survol',
    
    tabs: {
      linkPreview: {
        title: 'Aperçu de lien',
        tooltip: 'Configurer les paramètres d\'aperçu de lien'
      },
      dragText: {
        title: 'Glisser le texte',
        tooltip: 'Configurer les paramètres de glissement de texte'
      },
      other: {
        title: 'Autres paramètres',
        tooltip: 'Autres options de configuration'
      }
    },
    
    linkPreview: {
      title: 'Paramètres d\'aperçu de lien',
      enableLabel: 'Activer l\'aperçu de lien',
      enableDescription: 'Afficher l\'aperçu lors du survol des liens',

      triggerMethods: {
        drag: 'Glisser le lien',
        hover: 'Survol de la souris',
        longPress: 'Appui long sur le lien',

        customHover: 'Touche personnalisée+Survol',
        disabled: 'Désactivé'
      },
      shortcutKeyLabel: 'Touche de raccourci',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: 'Clic',
      hoverText: 'Survol',
      popupSizeLabel: 'Taille de la popup',
      popupSizes: {
        lastSize: 'Dernière taille',
        defaultSize: 'Taille par défaut',
        contentAdaptive: 'Adaptatif au contenu',
        last: 'Dernière taille',
        small: 'Petit',
        medium: 'Moyen',
        large: 'Grand'
      },
      popupPositionLabel: 'Position de la popup',
      popupPositions: {
        followMouse: 'Suivre la souris',
        center: 'Centre de l\'écran',
        topRight: 'Coin supérieur droit',
        last: 'Dernière position',
        left: 'Côté gauche',
        right: 'Côté droit'
      },
      themeLabel: 'Thème de la popup',
      themes: {
        light: 'Clair',
        dark: 'Sombre',
        blue: 'Bleu',
        red: 'Rouge',
        yellow: 'Jaune',
        green: 'Vert'
      },
      opacityLabel: 'Opacité de l\'arrière-plan',
      positionLabel: 'Position de l\'aperçu',
      positionDescription: 'Choisir où la fenêtre d\'aperçu apparaît',
      positions: {
        topLeft: 'En haut à gauche',
        topRight: 'En haut à droite',
        bottomLeft: 'En bas à gauche',
        bottomRight: 'En bas à droite'
      },
      delayLabel: 'Délai d\'affichage',
      delayDescription: 'Temps d\'attente avant d\'afficher l\'aperçu (millisecondes)',
      longPressDelayLabel: 'Délai d\'appui long',
      longPressDelayDescription: 'Temps d\'appui sur le lien avant d\'afficher l\'aperçu (millisecondes)',
      sizeLabel: 'Taille de l\'aperçu',
      sizeDescription: 'Choisir la taille de la fenêtre d\'aperçu',
      sizes: {
        small: 'Petit',
        medium: 'Moyen',
        large: 'Grand'
      }
    },
    
    dragText: {
      title: 'Paramètres de glissement de texte',
      searchEngineLabel: 'Moteur de recherche',
      searchEngines: {
        bing: 'Recherche Bing',
        google: 'Recherche Google',
        baidu: 'Recherche Baidu',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'Activer le glissement de texte',
      enableDescription: 'Permettre le glissement du texte sélectionné',
      maxLengthLabel: 'Longueur maximale',
      maxLengthDescription: 'Nombre maximum de caractères pour le texte glissé',
      customTextLabel: 'Texte personnalisé',
      customTextDescription: 'Définir le contenu du texte personnalisé à afficher lors du glissement',
      customTextPlaceholder: 'Entrez le contenu du texte personnalisé...',
      disabledSitesLabel: 'Sites web bloqués',
      disabledSitesDescription: 'Gérer la liste des sites web où la fonctionnalité de glissement de texte est désactivée',
      disabledSitesPlaceholder: 'Entrez les noms de domaine, un par ligne\nExemple:\nexample.com\nwww.google.com',
      domainFormatHint: 'Prend en charge les domaines primaires (example.com) et les sous-domaines (www.example.com)',
      domainCountHint: 'Domaines actuels: {count}/10',
      invalidDomains: 'Format de domaine invalide',
      exceedsLimitError: 'Maximum 10 domaines autorisés'
    },
    
    other: {
      title: 'Autres paramètres',
      themeLabel: 'Paramètres de thème',
      themeDescription: 'Choisir l\'apparence du thème de l\'application',
      themes: {
        system: 'Suivre le système',
        light: 'Clair',
        dark: 'Sombre'
      },
      languageLabel: 'Langue de l\'interface',
      languageDescription: 'Sélectionner la langue d\'affichage de l\'interface',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: 'L\'extension doit être rechargée après le changement de langue'
    },
    
    common: {
      enabled: 'Activé',
      disabled: 'Désactivé',
      save: 'Enregistrer',
      cancel: 'Annuler',
      reset: 'Réinitialiser'
    }
  },

  'de': {
    appTitle: 'Hover-Link-Vorschau',
    appDescription: 'Link-Vorschau beim Hovern anzeigen',
    
    tabs: {
      linkPreview: {
        title: 'Link-Vorschau',
        tooltip: 'Link-Vorschau-Einstellungen konfigurieren'
      },
      dragText: {
        title: 'Text ziehen',
        tooltip: 'Text-Ziehen-Einstellungen konfigurieren'
      },
      other: {
        title: 'Andere Einstellungen',
        tooltip: 'Andere Konfigurationsoptionen'
      }
    },
    
    linkPreview: {
      title: 'Link-Vorschau-Einstellungen',
      enableLabel: 'Link-Vorschau aktivieren',
      enableDescription: 'Vorschau beim Hovern über Links anzeigen',

      triggerMethods: {
        drag: 'Link ziehen',
        hover: 'Maus-Hover',
        longPress: 'Link lang drücken',

        customHover: 'Benutzerdefinierte Taste+Hover',
        disabled: 'Deaktiviert'
      },
      shortcutKeyLabel: 'Tastenkürzel',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Umschalt'
      },
      clickText: 'Klick',
      hoverText: 'Hover',
      popupSizeLabel: 'Popup-Größe',
      popupSizes: {
        lastSize: 'Letzte Größe',
        defaultSize: 'Standardgröße',
        contentAdaptive: 'Inhaltsanpassend',
        last: 'Letzte Größe',
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß'
      },
      popupPositionLabel: 'Popup-Position',
      popupPositions: {
        followMouse: 'Maus folgen',
        center: 'Bildschirmmitte',
        topRight: 'Obere rechte Ecke',
        last: 'Letzte Position',
        left: 'Linke Seite',
        right: 'Rechte Seite'
      },
      themeLabel: 'Popup-Theme',
      themes: {
        light: 'Hell',
        dark: 'Dunkel',
        blue: 'Blau',
        red: 'Rot',
        yellow: 'Gelb',
        green: 'Grün'
      },
      opacityLabel: 'Hintergrund-Transparenz',
      positionLabel: 'Vorschau-Position',
      positionDescription: 'Wählen Sie, wo das Vorschaufenster erscheint',
      positions: {
        topLeft: 'Oben links',
        topRight: 'Oben rechts',
        bottomLeft: 'Unten links',
        bottomRight: 'Unten rechts'
      },
      delayLabel: 'Anzeigeverzögerung',
      delayDescription: 'Wartezeit vor der Anzeige der Vorschau (Millisekunden)',
      longPressDelayLabel: 'Langes Drücken Verzögerung',
      longPressDelayDescription: 'Zeit des Drückens des Links vor der Anzeige der Vorschau (Millisekunden)',
      sizeLabel: 'Vorschau-Größe',
      sizeDescription: 'Größe des Vorschaufensters wählen',
      sizes: {
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß'
      }
    },
    
    dragText: {
      title: 'Text-Ziehen-Einstellungen',
      searchEngineLabel: 'Suchmaschine',
      searchEngines: {
        bing: 'Bing-Suche',
        google: 'Google-Suche',
        baidu: 'Baidu-Suche',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'Text-Ziehen aktivieren',
      enableDescription: 'Ziehen von ausgewähltem Text erlauben',
      maxLengthLabel: 'Maximale Länge',
      maxLengthDescription: 'Maximale Anzahl von Zeichen für gezogenen Text',
      customTextLabel: 'Benutzerdefinierter Text',
      customTextDescription: 'Benutzerdefinierte Textnachricht für die Textziehen-Funktion',
      customTextPlaceholder: 'Geben Sie Ihren benutzerdefinierten Text ein...',
      disabledSitesLabel: 'Blockierte Websites',
      disabledSitesDescription: 'Liste der Websites verwalten, auf denen die Textziehen-Funktion deaktiviert ist',
      disabledSitesPlaceholder: 'Domain-Namen eingeben, einen pro Zeile\nBeispiel:\nexample.com\nwww.google.com',
      domainFormatHint: 'Unterstützt primäre Domains (example.com) und Subdomains (www.example.com)',
      domainCountHint: 'Aktuelle Domains: {count}/10',
      invalidDomains: 'Ungültiges Domain-Format',
      exceedsLimitError: 'Maximal 10 Domains erlaubt'
    },
    
    other: {
      title: 'Andere Einstellungen',
      themeLabel: 'Theme-Einstellungen',
      themeDescription: 'Anwendungs-Theme-Erscheinungsbild wählen',
      themes: {
        system: 'System folgen',
        light: 'Hell',
        dark: 'Dunkel'
      },
      languageLabel: 'Oberflächensprache',
      languageDescription: 'Oberflächenanzeigesprache auswählen',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: 'Erweiterung muss nach Sprachänderung neu geladen werden'
    },
    
    common: {
      enabled: 'Aktiviert',
      disabled: 'Deaktiviert',
      save: 'Speichern',
      cancel: 'Abbrechen',
      reset: 'Zurücksetzen'
    }
  },

  'ru': {
    appTitle: 'Предварительный просмотр ссылки при наведении',
    appDescription: 'Показать предварительный просмотр ссылки при наведении',
    
    tabs: {
      linkPreview: {
        title: 'Предварительный просмотр ссылки',
        tooltip: 'Настроить параметры предварительного просмотра ссылки'
      },
      dragText: {
        title: 'Перетаскивание текста',
        tooltip: 'Настроить параметры перетаскивания текста'
      },
      other: {
        title: 'Другие настройки',
        tooltip: 'Другие параметры конфигурации'
      }
    },
    
    linkPreview: {
      title: 'Настройки предварительного просмотра ссылки',
      enableLabel: 'Включить предварительный просмотр ссылки',
      enableDescription: 'Показывать предварительный просмотр при наведении на ссылки',

      triggerMethods: {
        drag: 'Перетащить ссылку',
        hover: 'Наведение мыши',
        longPress: 'Долгое нажатие на ссылку',

        customHover: 'Пользовательская клавиша+Наведение',
        disabled: 'Отключено'
      },
      shortcutKeyLabel: 'Горячая клавиша',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: 'Клик',
      hoverText: 'Наведение',
      popupSizeLabel: 'Размер всплывающего окна',
      popupSizes: {
        lastSize: 'Последний размер',
        defaultSize: 'Размер по умолчанию',
        contentAdaptive: 'Адаптивный к содержимому',
        last: 'Последний размер',
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой'
      },
      popupPositionLabel: 'Позиция всплывающего окна',
      popupPositions: {
        followMouse: 'Следовать за мышью',
        center: 'Центр экрана',
        topRight: 'Верхний правый угол',
        last: 'Последняя позиция',
        left: 'Левая сторона',
        right: 'Правая сторона'
      },
      themeLabel: 'Тема всплывающего окна',
      themes: {
        light: 'Светлая',
        dark: 'Темная',
        blue: 'Синяя',
        red: 'Красная',
        yellow: 'Желтая',
        green: 'Зеленая'
      },
      opacityLabel: 'Прозрачность фона',
      positionLabel: 'Позиция предварительного просмотра',
      positionDescription: 'Выберите, где появляется окно предварительного просмотра',
      positions: {
        topLeft: 'Верхний левый',
        topRight: 'Верхний правый',
        bottomLeft: 'Нижний левый',
        bottomRight: 'Нижний правый'
      },
      delayLabel: 'Задержка отображения',
      delayDescription: 'Время ожидания перед показом предварительного просмотра (миллисекунды)',
      longPressDelayLabel: 'Задержка долгого нажатия',
      longPressDelayDescription: 'Время нажатия на ссылку перед показом предварительного просмотра (миллисекунды)',
      sizeLabel: 'Размер предварительного просмотра',
      sizeDescription: 'Выберите размер окна предварительного просмотра',
      sizes: {
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой'
      }
    },
    
    dragText: {
      title: 'Настройки перетаскивания текста',
      searchEngineLabel: 'Поисковая система',
      searchEngines: {
        bing: 'Поиск Bing',
        google: 'Поиск Google',
        baidu: 'Поиск Baidu',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'Включить перетаскивание текста',
      enableDescription: 'Разрешить перетаскивание выделенного текста',
      maxLengthLabel: 'Максимальная длина',
      maxLengthDescription: 'Максимальное количество символов для перетаскиваемого текста',
      customTextLabel: 'Пользовательский текст',
      customTextDescription: 'Пользовательское текстовое сообщение для функции перетаскивания текста',
      customTextPlaceholder: 'Введите ваш пользовательский текст...',
      disabledSitesLabel: 'Заблокированные веб-сайты',
      disabledSitesDescription: 'Управление списком веб-сайтов, где функция перетаскивания текста отключена',
      disabledSitesPlaceholder: 'Введите доменные имена, по одному в строке\nПример:\nexample.com\nwww.google.com',
      domainFormatHint: 'Поддерживает основные домены (example.com) и поддомены (www.example.com)',
      domainCountHint: 'Текущие домены: {count}/10',
      invalidDomains: 'Неверный формат домена',
      exceedsLimitError: 'Разрешено максимум 10 доменов'
    },
    
    other: {
      title: 'Другие настройки',
      themeLabel: 'Настройки темы',
      themeDescription: 'Выберите внешний вид темы приложения',
      themes: {
        system: 'Следовать системе',
        light: 'Светлая',
        dark: 'Темная'
      },
      languageLabel: 'Язык интерфейса',
      languageDescription: 'Выберите язык отображения интерфейса',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: 'Расширение необходимо перезагрузить после изменения языка'
    },
    
    common: {
      enabled: 'Включено',
      disabled: 'Отключено',
      save: 'Сохранить',
      cancel: 'Отмена',
      reset: 'Сброс'
    }
  },

  'it': {
    appTitle: 'Anteprima link al passaggio del mouse',
    appDescription: 'Mostra anteprima del link al passaggio del mouse',
    
    tabs: {
      linkPreview: {
        title: 'Anteprima link',
        tooltip: 'Configura le impostazioni dell\'anteprima del link'
      },
      dragText: {
        title: 'Trascina testo',
        tooltip: 'Configura le impostazioni di trascinamento del testo'
      },
      other: {
        title: 'Altre impostazioni',
        tooltip: 'Altre opzioni di configurazione'
      }
    },
    
    linkPreview: {
      title: 'Impostazioni anteprima link',
      enableLabel: 'Abilita anteprima link',
      enableDescription: 'Mostra anteprima al passaggio del mouse sui link',

      triggerMethods: {
        drag: 'Trascina link',
        hover: 'Passaggio del mouse',
        longPress: 'Pressione lunga del link',

        customHover: 'Tasto personalizzato+Passaggio del mouse',
        disabled: 'Disabilitato'
      },
      shortcutKeyLabel: 'Tasto di scelta rapida',
      shortcutKeys: {
        alt: 'Alt',
        cmd: 'Cmd',
        shift: 'Shift'
      },
      clickText: 'Clic',
      hoverText: 'Passaggio del mouse',
      popupSizeLabel: 'Dimensione popup',
      popupSizes: {
        lastSize: 'Ultima dimensione',
        defaultSize: 'Dimensione predefinita',
        contentAdaptive: 'Adattivo al contenuto',
        last: 'Ultima dimensione',
        small: 'Piccolo',
        medium: 'Medio',
        large: 'Grande'
      },
      popupPositionLabel: 'Posizione popup',
      popupPositions: {
        followMouse: 'Segui il mouse',
        center: 'Centro dello schermo',
        topRight: 'Angolo superiore destro',
        last: 'Ultima posizione',
        left: 'Lato sinistro',
        right: 'Lato destro'
      },
      themeLabel: 'Tema popup',
      themes: {
        light: 'Chiaro',
        dark: 'Scuro',
        blue: 'Blu',
        red: 'Rosso',
        yellow: 'Giallo',
        green: 'Verde'
      },
      opacityLabel: 'Opacità dello sfondo',
      positionLabel: 'Posizione anteprima',
      positionDescription: 'Scegli dove appare la finestra di anteprima',
      positions: {
        topLeft: 'In alto a sinistra',
        topRight: 'In alto a destra',
        bottomLeft: 'In basso a sinistra',
        bottomRight: 'In basso a destra'
      },
      delayLabel: 'Ritardo di visualizzazione',
      delayDescription: 'Tempo di attesa prima di mostrare l\'anteprima (millisecondi)',
      longPressDelayLabel: 'Ritardo pressione lunga',
      longPressDelayDescription: 'Tempo di pressione del link prima di mostrare l\'anteprima (millisecondi)',
      sizeLabel: 'Dimensione anteprima',
      sizeDescription: 'Scegli la dimensione della finestra di anteprima',
      sizes: {
        small: 'Piccola',
        medium: 'Media',
        large: 'Grande'
      }
    },
    
    dragText: {
      title: 'Impostazioni trascinamento testo',
      searchEngineLabel: 'Motore di ricerca',
      searchEngines: {
        bing: 'Ricerca Bing',
        google: 'Ricerca Google',
        baidu: 'Ricerca Baidu',
        duckduckgo: 'DuckDuckGo'
      },
      enableLabel: 'Abilita trascinamento testo',
      enableDescription: 'Consenti il trascinamento del testo selezionato',
      maxLengthLabel: 'Lunghezza massima',
      maxLengthDescription: 'Numero massimo di caratteri per il testo trascinato',
      customTextLabel: 'Testo personalizzato',
      customTextDescription: 'Messaggio di testo personalizzato per la funzionalità di trascinamento del testo',
      customTextPlaceholder: 'Inserisci il tuo testo personalizzato...',
      disabledSitesLabel: 'Siti web bloccati',
      disabledSitesDescription: 'Gestire l\'elenco dei siti web dove la funzionalità di trascinamento del testo è disabilitata',
      disabledSitesPlaceholder: 'Inserire i nomi di dominio, uno per riga\nEsempio:\nexample.com\nwww.google.com',
      domainFormatHint: 'Supporta domini primari (example.com) e sottodomini (www.example.com)',
      domainCountHint: 'Domini attuali: {count}/10',
      invalidDomains: 'Formato dominio non valido',
      exceedsLimitError: 'Massimo 10 domini consentiti'
    },
    
    other: {
      title: 'Altre impostazioni',
      themeLabel: 'Impostazioni tema',
      themeDescription: 'Scegli l\'aspetto del tema dell\'applicazione',
      themes: {
        system: 'Segui il sistema',
        light: 'Chiaro',
        dark: 'Scuro'
      },
      languageLabel: 'Lingua dell\'interfaccia',
      languageDescription: 'Seleziona la lingua di visualizzazione dell\'interfaccia',
      languages: {
        'zh-CN': '中文（简体）',
        'zh-TW': '中文（繁體）',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'it': 'Italiano',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      },
      reloadNote: 'L\'estensione deve essere ricaricata dopo il cambio di lingua'
    },
    
    common: {
      enabled: 'Abilitato',
      disabled: 'Disabilitato',
      save: 'Salva',
       cancel: 'Annulla',
       reset: 'Ripristina'
     }
   },

   'es': {
     appTitle: 'Vista previa de enlace al pasar el ratón',
     appDescription: 'Mostrar vista previa del enlace al pasar el ratón',
     
     tabs: {
       linkPreview: {
         title: 'Vista previa de enlace',
         tooltip: 'Configurar ajustes de vista previa de enlace'
       },
       dragText: {
         title: 'Arrastrar texto',
         tooltip: 'Configurar ajustes de arrastre de texto'
       },
       other: {
         title: 'Otros ajustes',
         tooltip: 'Otras opciones de configuración'
       }
     },
     
     linkPreview: {
       title: 'Ajustes de vista previa de enlace',
       enableLabel: 'Habilitar vista previa de enlace',
       enableDescription: 'Mostrar vista previa al pasar el ratón sobre enlaces',
       
       triggerMethods: {
         drag: 'Arrastrar enlace',
         hover: 'Pasar el ratón',
         longPress: 'Presión larga del enlace',
 
         customHover: 'Tecla personalizada+Pasar el ratón',
         disabled: 'Deshabilitado'
       },
       shortcutKeyLabel: 'Tecla de acceso directo',
       shortcutKeys: {
         alt: 'Alt',
         cmd: 'Cmd',
         shift: 'Shift'
       },
       clickText: 'Clic',
       hoverText: 'Pasar el ratón',
       popupSizeLabel: 'Tamaño de ventana emergente',
       popupSizes: {
         lastSize: 'Último tamaño',
         defaultSize: 'Tamaño predeterminado',
         contentAdaptive: 'Adaptativo al contenido',
         last: 'Último tamaño',
         small: 'Pequeño',
         medium: 'Mediano',
         large: 'Grande'
       },
       popupPositionLabel: 'Posición de ventana emergente',
       popupPositions: {
         followMouse: 'Seguir el ratón',
         center: 'Centro de pantalla',
         topRight: 'Esquina superior derecha',
         last: 'Última posición',
         left: 'Lado izquierdo',
         right: 'Lado derecho'
       },
       themeLabel: 'Tema de ventana emergente',
       themes: {
         light: 'Claro',
         dark: 'Oscuro',
         blue: 'Azul',
         red: 'Rojo',
         yellow: 'Amarillo',
         green: 'Verde'
       },
       opacityLabel: 'Opacidad del fondo',
       positionLabel: 'Posición de vista previa',
       positionDescription: 'Elegir dónde aparece la ventana de vista previa',
       positions: {
         topLeft: 'Arriba a la izquierda',
         topRight: 'Arriba a la derecha',
         bottomLeft: 'Abajo a la izquierda',
         bottomRight: 'Abajo a la derecha'
       },
       delayLabel: 'Retraso de visualización',
       delayDescription: 'Tiempo de espera antes de mostrar la vista previa (milisegundos)',
       longPressDelayLabel: 'Retraso de presión larga',
       longPressDelayDescription: 'Tiempo de presión del enlace antes de mostrar la vista previa (milisegundos)',
       sizeLabel: 'Tamaño de vista previa',
       sizeDescription: 'Elegir el tamaño de la ventana de vista previa',
       sizes: {
         small: 'Pequeño',
         medium: 'Mediano',
         large: 'Grande'
       }
     },
     
     dragText: {
       title: 'Ajustes de arrastre de texto',
       searchEngineLabel: 'Motor de búsqueda',
       searchEngines: {
         bing: 'Búsqueda Bing',
         google: 'Búsqueda Google',
         baidu: 'Búsqueda Baidu',
         duckduckgo: 'DuckDuckGo'
       },
       enableLabel: 'Habilitar arrastre de texto',
       enableDescription: 'Permitir arrastrar texto seleccionado',
       maxLengthLabel: 'Longitud máxima',
       maxLengthDescription: 'Número máximo de caracteres para texto arrastrado',
       customTextLabel: 'Texto personalizado',
       customTextDescription: 'Mensaje de texto personalizado para la funcionalidad de arrastre de texto',
       customTextPlaceholder: 'Introduce tu texto personalizado...',
       disabledSitesLabel: 'Sitios web bloqueados',
       disabledSitesDescription: 'Gestionar la lista de sitios web donde la funcionalidad de arrastre de texto está deshabilitada',
       disabledSitesPlaceholder: 'Introducir nombres de dominio, uno por línea\nEjemplo:\nexample.com\nwww.google.com',
       domainFormatHint: 'Soporta dominios primarios (example.com) y subdominios (www.example.com)',
       domainCountHint: 'Dominios actuales: {count}/10',
       invalidDomains: 'Formato de dominio inválido',
       exceedsLimitError: 'Máximo 10 dominios permitidos'
     },
     
     other: {
       title: 'Otros ajustes',
       themeLabel: 'Ajustes de tema',
       themeDescription: 'Elegir apariencia del tema de la aplicación',
       themes: {
         system: 'Seguir el sistema',
         light: 'Claro',
         dark: 'Oscuro'
       },
       languageLabel: 'Idioma de la interfaz',
       languageDescription: 'Seleccionar idioma de visualización de la interfaz',
       languages: {
         'zh-CN': '中文（简体）',
         'zh-TW': '中文（繁體）',
         'en': 'English',
         'ja': '日本語',
         'ko': '한국어',
         'fr': 'Français',
         'de': 'Deutsch',
         'ru': 'Русский',
         'it': 'Italiano',
         'es': 'Español',
         'pt': 'Português',
         'ar': 'العربية'
       },
       reloadNote: 'La extensión debe recargarse después del cambio de idioma'
     },
     
     common: {
       enabled: 'Habilitado',
       disabled: 'Deshabilitado',
       save: 'Guardar',
       cancel: 'Cancelar',
       reset: 'Restablecer'
     }
   },

   'pt': {
     appTitle: 'Visualização de link ao passar o mouse',
     appDescription: 'Mostrar visualização do link ao passar o mouse',
     
     tabs: {
       linkPreview: {
         title: 'Visualização de link',
         tooltip: 'Configurar definições de visualização de link'
       },
       dragText: {
         title: 'Arrastar texto',
         tooltip: 'Configurar definições de arrastar texto'
       },
       other: {
         title: 'Outras definições',
         tooltip: 'Outras opções de configuração'
       }
     },
     
     linkPreview: {
       title: 'Definições de visualização de link',
       enableLabel: 'Ativar visualização de link',
       enableDescription: 'Mostrar visualização ao passar o mouse sobre links',
       
       triggerMethods: {
         drag: 'Arrastar link',
         hover: 'Passar o mouse',
         longPress: 'Pressão longa do link',
 
         customHover: 'Tecla personalizada+Passar o mouse',
         disabled: 'Desativado'
       },
       shortcutKeyLabel: 'Tecla de atalho',
       shortcutKeys: {
         alt: 'Alt',
         cmd: 'Cmd',
         shift: 'Shift'
       },
       clickText: 'Clique',
       hoverText: 'Passar o mouse',
       popupSizeLabel: 'Tamanho do popup',
       popupSizes: {
          lastSize: 'Último tamanho',
          defaultSize: 'Tamanho padrão',
          contentAdaptive: 'Adaptativo ao conteúdo',
          last: 'Último tamanho',
          small: 'Pequeno',
          medium: 'Médio',
          large: 'Grande'
        },
       popupPositionLabel: 'Posição do popup',
       popupPositions: {
          followMouse: 'Seguir o mouse',
          center: 'Centro da tela',
          topRight: 'Canto superior direito',
          last: 'Última posição',
          left: 'Lado esquerdo',
          right: 'Lado direito'
        },
       themeLabel: 'Tema do popup',
       themes: {
         light: 'Claro',
         dark: 'Escuro',
         blue: 'Azul',
         red: 'Vermelho',
         yellow: 'Amarelo',
         green: 'Verde'
       },
       opacityLabel: 'Opacidade do fundo',
       positionLabel: 'Posição da visualização',
       positionDescription: 'Escolher onde a janela de visualização aparece',
       positions: {
         topLeft: 'Superior esquerdo',
         topRight: 'Superior direito',
         bottomLeft: 'Inferior esquerdo',
         bottomRight: 'Inferior direito'
       },
       delayLabel: 'Atraso de exibição',
       delayDescription: 'Tempo de espera antes de mostrar a visualização (milissegundos)',
       longPressDelayLabel: 'Atraso de pressão longa',
       longPressDelayDescription: 'Tempo de pressão do link antes de mostrar a visualização (milissegundos)',
       sizeLabel: 'Tamanho da visualização',
       sizeDescription: 'Escolher o tamanho da janela de visualização',
       sizes: {
         small: 'Pequeno',
         medium: 'Médio',
         large: 'Grande'
       }
     },
     
     dragText: {
       title: 'Definições de arrastar texto',
       searchEngineLabel: 'Motor de busca',
       searchEngines: {
         bing: 'Busca Bing',
         google: 'Busca Google',
         baidu: 'Busca Baidu',
         duckduckgo: 'DuckDuckGo'
       },
       enableLabel: 'Ativar arrastar texto',
       enableDescription: 'Permitir arrastar texto selecionado',
       maxLengthLabel: 'Comprimento máximo',
       maxLengthDescription: 'Número máximo de caracteres para texto arrastado',
       customTextLabel: 'Texto personalizado',
       customTextDescription: 'Mensagem de texto personalizada para a funcionalidade de arrastar texto',
       customTextPlaceholder: 'Insira o seu texto personalizado...',
       disabledSitesLabel: 'Sites bloqueados',
       disabledSitesDescription: 'Gerir a lista de sites onde a funcionalidade de arrastar texto está desabilitada',
       disabledSitesPlaceholder: 'Inserir nomes de domínio, um por linha\nExemplo:\nexample.com\nwww.google.com',
       domainFormatHint: 'Suporta domínios primários (example.com) e subdomínios (www.example.com)',
       domainCountHint: 'Domínios atuais: {count}/10',
       invalidDomains: 'Formato de domínio inválido',
       exceedsLimitError: 'Máximo 10 domínios permitidos'
     },
     
     other: {
       title: 'Outras definições',
       themeLabel: 'Definições de tema',
       themeDescription: 'Escolher aparência do tema da aplicação',
       themes: {
         system: 'Seguir o sistema',
         light: 'Claro',
         dark: 'Escuro'
       },
       languageLabel: 'Idioma da interface',
       languageDescription: 'Selecionar idioma de exibição da interface',
       languages: {
         'zh-CN': '中文（简体）',
         'zh-TW': '中文（繁體）',
         'en': 'English',
         'ja': '日本語',
         'ko': '한국어',
         'fr': 'Français',
         'de': 'Deutsch',
         'ru': 'Русский',
         'it': 'Italiano',
         'es': 'Español',
         'pt': 'Português',
         'ar': 'العربية'
       },
       reloadNote: 'A extensão precisa ser recarregada após a mudança de idioma'
     },
     
     common: {
       enabled: 'Ativado',
       disabled: 'Desativado',
       save: 'Salvar',
       cancel: 'Cancelar',
       reset: 'Redefinir'
     }
   },

   'ar': {
     appTitle: 'معاينة الرابط عند التمرير',
     appDescription: 'إظهار معاينة الرابط عند التمرير',
     
     tabs: {
       linkPreview: {
         title: 'معاينة الرابط',
         tooltip: 'تكوين إعدادات معاينة الرابط'
       },
       dragText: {
         title: 'سحب النص',
         tooltip: 'تكوين إعدادات سحب النص'
       },
       other: {
         title: 'إعدادات أخرى',
         tooltip: 'خيارات تكوين أخرى'
       }
     },
     
     linkPreview: {
       title: 'إعدادات معاينة الرابط',
       enableLabel: 'تمكين معاينة الرابط',
       enableDescription: 'إظهار المعاينة عند التمرير فوق الروابط',
       
       triggerMethods: {
         drag: 'سحب الرابط',
         hover: 'تمرير الماوس',
         longPress: 'الضغط الطويل على الرابط',
 
         customHover: 'مفتاح مخصص+التمرير',
         disabled: 'معطل'
       },
       shortcutKeyLabel: 'مفتاح الاختصار',
       shortcutKeys: {
         alt: 'Alt',
         cmd: 'Cmd',
         shift: 'Shift'
       },
       clickText: 'نقر',
       hoverText: 'تمرير',
       popupSizeLabel: 'حجم النافذة المنبثقة',
       popupSizes: {
          lastSize: 'الحجم الأخير',
          defaultSize: 'الحجم الافتراضي',
          contentAdaptive: 'تكيفي مع المحتوى',
          last: 'الحجم الأخير',
          small: 'صغير',
          medium: 'متوسط',
          large: 'كبير'
        },
       popupPositionLabel: 'موضع النافذة المنبثقة',
       popupPositions: {
          followMouse: 'تتبع الماوس',
          center: 'وسط الشاشة',
          topRight: 'الزاوية العلوية اليمنى',
          last: 'الموضع الأخير',
          left: 'يسار الشاشة',
          right: 'يمين الشاشة'
        },
       themeLabel: 'موضوع النافذة المنبثقة',
       themes: {
         light: 'فاتح',
         dark: 'داكن',
         blue: 'أزرق',
         red: 'أحمر',
         yellow: 'أصفر',
         green: 'أخضر'
       },
       opacityLabel: 'شفافية الخلفية',
       positionLabel: 'موضع المعاينة',
       positionDescription: 'اختر مكان ظهور نافذة المعاينة',
       positions: {
         topLeft: 'أعلى اليسار',
         topRight: 'أعلى اليمين',
         bottomLeft: 'أسفل اليسار',
         bottomRight: 'أسفل اليمين'
       },
       delayLabel: 'تأخير العرض',
       delayDescription: 'وقت الانتظار قبل إظهار المعاينة (بالميلي ثانية)',
       longPressDelayLabel: 'تأخير الضغط الطويل',
       longPressDelayDescription: 'وقت الضغط على الرابط قبل إظهار المعاينة (بالميلي ثانية)',
       sizeLabel: 'حجم المعاينة',
       sizeDescription: 'اختر حجم نافذة المعاينة',
       sizes: {
         small: 'صغير',
         medium: 'متوسط',
         large: 'كبير'
       }
     },
     
     dragText: {
       title: 'إعدادات سحب النص',
       searchEngineLabel: 'محرك البحث',
       searchEngines: {
         bing: 'بحث Bing',
         google: 'بحث Google',
         baidu: 'بحث Baidu',
         duckduckgo: 'DuckDuckGo'
       },
       enableLabel: 'تمكين سحب النص',
       enableDescription: 'السماح بسحب النص المحدد',
       maxLengthLabel: 'الطول الأقصى',
       maxLengthDescription: 'العدد الأقصى من الأحرف للنص المسحوب',
       customTextLabel: 'نص مخصص',
       customTextDescription: 'رسالة نصية مخصصة لوظيفة سحب النص',
       customTextPlaceholder: 'أدخل النص المخصص الخاص بك...',
       disabledSitesLabel: 'المواقع المحظورة',
       disabledSitesDescription: 'إدارة قائمة المواقع التي تم تعطيل وظيفة سحب النص فيها',
       disabledSitesPlaceholder: 'أدخل أسماء النطاقات، واحد في كل سطر\nمثال:\nexample.com\nwww.google.com',
       domainFormatHint: 'يدعم النطاقات الأساسية (example.com) والنطاقات الفرعية (www.example.com)',
       domainCountHint: 'النطاقات الحالية: {count}/10',
       invalidDomains: 'تنسيق النطاق غير صالح',
       exceedsLimitError: 'الحد الأقصى 10 نطاقات مسموح'
     },
     
     other: {
       title: 'إعدادات أخرى',
       themeLabel: 'إعدادات الموضوع',
       themeDescription: 'اختر مظهر موضوع التطبيق',
       themes: {
         system: 'تتبع النظام',
         light: 'فاتح',
         dark: 'داكن'
       },
       languageLabel: 'لغة الواجهة',
       languageDescription: 'اختر لغة عرض الواجهة',
       languages: {
         'zh-CN': '中文（简体）',
         'zh-TW': '中文（繁體）',
         'en': 'English',
         'ja': '日本語',
         'ko': '한국어',
         'fr': 'Français',
         'de': 'Deutsch',
         'ru': 'Русский',
         'it': 'Italiano',
         'es': 'Español',
         'pt': 'Português',
         'ar': 'العربية'
       },
       reloadNote: 'يجب إعادة تحميل الإضافة بعد تغيير اللغة'
     },
     
     common: {
       enabled: 'مُمكن',
       disabled: 'معطل',
       save: 'حفظ',
       cancel: 'إلغاء',
       reset: 'إعادة تعيين'
     }
   }
 };

export function getTranslation(language: Language): Translations {
  // 深度合并：对缺失的键使用英文作为回退，避免各语言未及时补充新文案导致的 undefined
  function deepMerge<T>(base: any, overrides: any): any {
    if (base === null || typeof base !== 'object') return overrides ?? base;
    const result: any = Array.isArray(base) ? [...base] : { ...base };
    if (overrides === null || typeof overrides !== 'object') return result;
    for (const key of Object.keys(overrides)) {
      const b = (base as any)[key];
      const o = (overrides as any)[key];
      if (
        b && o && typeof b === 'object' && typeof o === 'object' &&
        !Array.isArray(b) && !Array.isArray(o)
      ) {
        result[key] = deepMerge(b, o);
      } else if (o !== undefined) {
        result[key] = o;
      }
    }
    return result;
  }
  const langPack = translations[language] || ({} as Partial<Translations>);
  return deepMerge(translations['en'], langPack) as Translations;
}