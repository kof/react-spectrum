/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaButtonProps} from '@react-types/button';
import {AriaMenuOptions} from './useMenu';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {MenuTriggerState} from '@react-stately/menu';
import {MenuTriggerType} from '@react-types/menu';
import {RefObject} from 'react';
import {useId} from '@react-aria/utils';
import {useLongPress} from '@react-aria/interactions';
import {useMessageFormatter} from '@react-aria/i18n';
import {useOverlayTrigger} from '@react-aria/overlays';

interface MenuTriggerAriaProps {
  /** The type of menu that the menu trigger opens. */
  type?: 'menu' | 'listbox',
  /** Whether menu trigger is disabled. */
  isDisabled?: boolean,
  /** How menu is triggered. */
  trigger?: MenuTriggerType
}

interface MenuTriggerAria<T> {
  /** Props for the menu trigger element. */
  menuTriggerProps: AriaButtonProps,

  /** Props for the menu. */
  menuProps: AriaMenuOptions<T>
}

/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 * @param props - Props for the menu trigger.
 * @param state - State for the menu trigger.
 */
export function useMenuTrigger<T>(props: MenuTriggerAriaProps, state: MenuTriggerState, ref: RefObject<HTMLElement>): MenuTriggerAria<T> {
  let {
    type = 'menu' as MenuTriggerAriaProps['type'],
    isDisabled,
    trigger = 'press'
  } = props;

  let menuTriggerId = useId();
  let {triggerProps, overlayProps} = useOverlayTrigger({type}, state, ref);

  let onKeyDown = (e) => {
    if (isDisabled) {
      return;
    }

    if (trigger === 'longPress' && !e.altKey) {
      return;
    }

    if (ref && ref.current) {
      switch (e.key) {
        case 'Enter':
        case ' ':
          if (trigger === 'longPress') {
            return;
          }
          // fallthrough
        case 'ArrowDown':
          // Stop propagation, unless it would already be handled by useKeyboard.
          if (!('continuePropagation' in e)) {
            e.stopPropagation();
          }
          e.preventDefault();
          state.toggle('first');
          break;
        case 'ArrowUp':
          if (!('continuePropagation' in e)) {
            e.stopPropagation();
          }
          e.preventDefault();
          state.toggle('last');
          break;
      }
    }
  };

  let formatMessage = useMessageFormatter(intlMessages);
  let {longPressProps} = useLongPress({
    isDisabled: isDisabled || trigger !== 'longPress',
    accessibilityDescription: formatMessage('longPressMessage'),
    onLongPressStart() {
      state.close();
    },
    onLongPress() {
      state.open('first');
    }
  });

  let pressProps =  {
    onPressStart(e) {
      // For consistency with native, open the menu on mouse/key down, but touch up.
      if (e.pointerType !== 'touch' && e.pointerType !== 'keyboard' && !isDisabled) {
        // If opened with a screen reader, auto focus the first item.
        // Otherwise, the menu itself will be focused.
        state.toggle(e.pointerType === 'virtual' ? 'first' : null);
      }
    },
    onPress(e) {
      if (e.pointerType === 'touch' && !isDisabled) {
        state.toggle();
      }
    }
  };

  return {
    menuTriggerProps: {
      ...triggerProps,
      ...(trigger === 'press' ? pressProps : longPressProps),
      id: menuTriggerId,
      onKeyDown
    },
    menuProps: {
      ...overlayProps,
      'aria-labelledby': menuTriggerId,
      autoFocus: state.focusStrategy,
      onClose: state.close
    }
  };
}
