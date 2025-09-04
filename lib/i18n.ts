export type Language = 'zh-CN' | 'en' | 'ja' | 'ko';

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
    triggerMethodLabel: string;
    triggerMethods: {
      drag: string;
      hover: string;
      altClick: string;
    };
    shortcutKeyLabel: string;
    shortcutKeys: {
      alt: string;
      ctrl: string;
      shift: string;
    };
    popupSizeLabel: string;
    popupSizes: {
      lastSize: string;
      defaultSize: string;
      contentAdaptive: string;
    };
    popupPositionLabel: string;
    popupPositions: {
      followMouse: string;
      center: string;
      topRight: string;
    };
    themeLabel: string;
    themes: {
      light: string;
      dark: string;
      blue: string;
      red: string;
      yellow: string;
      green: string;
    };
    opacityLabel: string;
    positionLabel: string;
    positionDescription: string;
    positions: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
    };
    delayLabel: string;
    delayDescription: string;
    sizeLabel: string;
    sizeDescription: string;
    sizes: {
      small: string;
      medium: string;
      large: string;
    };
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
      'en': string;
      'ja': string;
      'ko': string;
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
      triggerMethodLabel: '触发方式',
      triggerMethods: {
        drag: '拖动链接',
        hover: '鼠标悬停',
        altClick: 'Alt+鼠标左键点击'
      },
      shortcutKeyLabel: '快捷键',
      shortcutKeys: {
        alt: 'Alt',
        ctrl: 'Ctrl',
        shift: 'Shift'
      },
      popupSizeLabel: '弹窗大小',
      popupSizes: {
        lastSize: '上次大小',
        defaultSize: '默认大小',
        contentAdaptive: '内容自适应'
      },
      popupPositionLabel: '弹窗位置',
      popupPositions: {
        followMouse: '跟随鼠标',
        center: '屏幕居中',
        topRight: '屏幕右上角'
      },
      themeLabel: '弹窗主题',
      themes: {
        light: '浅色',
        dark: '深色',
        blue: '蓝色',
        red: '红色',
        yellow: '黄色',
        green: '绿色'
      },
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
      customTextDescription: '设置自定义的拖拽文本内容',
      customTextPlaceholder: '输入自定义文本...'
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
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어'
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
      triggerMethodLabel: 'Trigger Method',
      triggerMethods: {
        drag: 'Drag Link',
        hover: 'Mouse Hover',
        altClick: 'Alt+Left Click'
      },
      shortcutKeyLabel: 'Shortcut Key',
      shortcutKeys: {
        alt: 'Alt',
        ctrl: 'Ctrl',
        shift: 'Shift'
      },
      popupSizeLabel: 'Popup Size',
      popupSizes: {
        lastSize: 'Last Size',
        defaultSize: 'Default Size',
        contentAdaptive: 'Content Adaptive'
      },
      popupPositionLabel: 'Popup Position',
      popupPositions: {
        followMouse: 'Follow Mouse',
        center: 'Screen Center',
        topRight: 'Top Right Corner'
      },
      themeLabel: 'Popup Theme',
      themes: {
        light: 'Light',
        dark: 'Dark',
        blue: 'Blue',
        red: 'Red',
        yellow: 'Yellow',
        green: 'Green'
      },
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
      customTextDescription: 'Set custom text content for dragging',
      customTextPlaceholder: 'Enter custom text...'
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
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어'
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
      triggerMethodLabel: 'トリガー方法',
      triggerMethods: {
        drag: 'リンクをドラッグ',
        hover: 'マウスホバー',
        altClick: 'Alt+左クリック'
      },
      shortcutKeyLabel: 'ショートカットキー',
      shortcutKeys: {
        alt: 'Alt',
        ctrl: 'Ctrl',
        shift: 'Shift'
      },
      popupSizeLabel: 'ポップアップサイズ',
      popupSizes: {
        lastSize: '前回のサイズ',
        defaultSize: 'デフォルトサイズ',
        contentAdaptive: 'コンテンツ適応'
      },
      popupPositionLabel: 'ポップアップ位置',
      popupPositions: {
        followMouse: 'マウスに追従',
        center: '画面中央',
        topRight: '右上角'
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
      customTextDescription: 'ドラッグ用のカスタムテキスト内容を設定',
      customTextPlaceholder: 'カスタムテキストを入力...'
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
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어'
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
      triggerMethodLabel: '트리거 방법',
      triggerMethods: {
        drag: '링크 드래그',
        hover: '마우스 호버',
        altClick: 'Alt+왼쪽 클릭'
      },
      shortcutKeyLabel: '단축키',
      shortcutKeys: {
        alt: 'Alt',
        ctrl: 'Ctrl',
        shift: 'Shift'
      },
      popupSizeLabel: '팝업 크기',
      popupSizes: {
        lastSize: '마지막 크기',
        defaultSize: '기본 크기',
        contentAdaptive: '콘텐츠 적응'
      },
      popupPositionLabel: '팝업 위치',
      popupPositions: {
        followMouse: '마우스 따라가기',
        center: '화면 중앙',
        topRight: '오른쪽 위 모서리'
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
      customTextDescription: '드래그용 사용자 정의 텍스트 내용 설정',
      customTextPlaceholder: '사용자 정의 텍스트 입력...'
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
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어'
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
  }
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations['zh-CN'];
}