import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import { Platform, Pressable, StyleSheet, Switch, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: {
    ios: SFSymbol;
    android?: AndroidSymbol;
    backgroundColor?: string;
  };
  value?: string;
  type?: 'navigation' | 'toggle' | 'detail' | 'destructive' | 'checkmark';
  checked?: boolean;
  accessoryTintColor?: string;
  toggleValue?: boolean;
  onToggleChange?: (val: boolean) => void;
  onPress?: () => void;
  showSeparator?: boolean;
  separatorInset?: 'text' | 'full';
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  title,
  subtitle,
  icon,
  value,
  type = 'navigation',
  checked,
  accessoryTintColor,
  toggleValue,
  onToggleChange,
  onPress,
  showSeparator = false,
  separatorInset = 'text',
  style,
}: ListRowProps) {
  const separatorHeight = Platform.OS === 'android' ? 1 : Math.max(StyleSheet.hairlineWidth, 0.5);

  return (
    <View style={style} className="bg-secondarySystemGroupedBackground">
      <Pressable
        onPress={type !== 'toggle' ? onPress : undefined}
        disabled={type === 'detail' || type === 'toggle'}
        accessibilityRole={type === 'toggle' ? 'switch' : type === 'checkmark' ? 'checkbox' : 'button'}
        accessibilityState={type === 'checkmark' ? { checked } : undefined}
        className="min-h-[44px] flex-row items-center px-4 py-2.5 active:bg-systemFill/25"
      >
        {/* Standard Apple App Icon Badge */}
        {icon ? (
          <View
            style={{ backgroundColor: icon.backgroundColor ?? '#007aff' }}
            className="mr-3.5 h-[28px] w-[28px] items-center justify-center rounded-[6px]"
          >
            <SymbolView
              name={{ ios: icon.ios, android: icon.android }}
              size={18}
              tintColor="#ffffff"
            />
          </View>
        ) : null}

        {/* Row Label & Subtitle */}
        <View className="flex-1 justify-center">
          <Text
            numberOfLines={1}
            className={`text-ios-body ${
              type === 'destructive' ? 'text-systemRed font-medium' : 'text-label'
            }`}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} className="mt-0.5 text-ios-caption1 text-secondaryLabel">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Switch Toggle Accessory */}
        {type === 'toggle' ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{
              true: Platform.select({ ios: '#34c759', default: '#34c759' }),
            }}
          />
        ) : null}

        {/* Standard Disclosure Indicator Accessory */}
        {type === 'navigation' ? (
          <View className="flex-row items-center gap-1.5">
            {value ? (
              <Text numberOfLines={1} className="text-ios-body text-secondaryLabel">
                {value}
              </Text>
            ) : null}
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right' }}
              size={14}
              tintColor="#c7c7cc"
            />
          </View>
        ) : null}

        {/* Detail Label Accessory */}
        {type === 'detail' && value ? (
          <Text numberOfLines={1} className="text-ios-body text-secondaryLabel">
            {value}
          </Text>
        ) : null}

        {/* Checkmark Accessory for Selection Lists */}
        {type === 'checkmark' && checked ? (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check' }}
            size={18}
            tintColor={accessoryTintColor ?? '#007aff'}
          />
        ) : null}
      </Pressable>

      {/* iOS Hairline Inset Separator Line */}
      {showSeparator ? (
        <View
          style={{
            height: separatorHeight,
            zIndex: 10,
          }}
          className={`${
            separatorInset === 'full'
              ? 'ml-0'
              : icon
              ? 'ml-[58px]'
              : 'ml-4'
          } bg-separator`}
        />
      ) : null}
    </View>
  );
}
