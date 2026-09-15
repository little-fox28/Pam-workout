import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export interface ListGroupProps extends ViewProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
}

export function ListGroup({ header, footer, children, className, ...props }: ListGroupProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <View className={`mb-6 ${className ?? ''}`} {...props}>
      {/* iOS Section Header (13pt, Uppercase, Secondary Label) */}
      {header ? (
        <Text
          numberOfLines={1}
          className="px-4 pb-1.5 text-ios-footnote font-normal uppercase tracking-tight text-secondaryLabel"
        >
          {header}
        </Text>
      ) : null}

      {/* Inset Grouped Card (Secondary System Grouped Background, Continuous Radius) */}
      <View
        className="mx-4 overflow-hidden rounded-ios-card bg-secondarySystemGroupedBackground"
        style={{
          // Native Apple continuous squircle curvature
          borderRadius: 12,
          // @ts-expect-error React Native experimental property for iOS
          experimental_cornerStyle: 'continuous',
        }}
      >
        {childrenArray.map((child, index) => {
          const isLast = index === childrenArray.length - 1;
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              key: (child as React.ReactElement<any>).key ?? index,
              style: [
                { zIndex: childrenArray.length - index },
                (child.props as any).style,
              ],
              showSeparator:
                (child.props as any).showSeparator !== undefined
                  ? (child.props as any).showSeparator
                  : !isLast,
            });
          }
          return child;
        })}
      </View>

      {/* iOS Section Footer Note */}
      {footer ? (
        <Text className="px-4 pt-1.5 text-ios-footnote text-secondaryLabel">
          {footer}
        </Text>
      ) : null}
    </View>
  );
}
