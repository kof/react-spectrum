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

import {action} from '@storybook/addon-actions';
import {ColorArea, ColorField, ColorSlider, ColorWheel} from '../';
import {Flex, Grid, View} from '@adobe/react-spectrum';
import {Meta, Story} from '@storybook/react';
import {parseColor} from '@react-stately/color';
import React, {useState} from 'react';
import {SpectrumColorAreaProps} from '@react-types/color';

const meta: Meta<SpectrumColorAreaProps> = {
  title: 'ColorArea',
  component: ColorArea
};

export default meta;

const Template: Story<SpectrumColorAreaProps> = (args) => (
  <ColorAreaExample {...args} />
);

function ColorAreaExample(props: SpectrumColorAreaProps) {
  let {xChannel, yChannel, isDisabled, 'aria-label': ariaLabel} = props;
  let defaultValue = typeof props.defaultValue === 'string' ? parseColor(props.defaultValue) : props.defaultValue;
  let [color, setColor] = useState(defaultValue || parseColor('#ff00ff'));
  let xyChannels = {xChannel, yChannel};
  let colorSpace = color.getColorSpace();
  let {zChannel} = color.getColorSpaceAxes(xyChannels);
  let isHue = zChannel === 'hue';

  function onChange(e) {
    const newColor = (e || color).toFormat(colorSpace);
    if (props.onChange) {
      props.onChange(newColor);
    }
    setColor(newColor);
  }

  return (
    <div role="group" aria-label={`${ariaLabel ? `${ariaLabel} ` : ''}${colorSpace.toUpperCase()} Color Picker`}>
      <Flex gap="size-500" alignItems="start">
        {isHue ? (
          <Flex direction="column" gap={0} alignItems="center">
            <View
              position="relative"
              width="size-2400">
              <Grid
                position="absolute"
                justifyContent="center"
                alignContent="center"
                width="100%"
                height="100%">
                <ColorArea
                  size={'size-1200'}
                  {...props}
                  value={color}
                  onChange={onChange}
                  onChangeEnd={props.onChangeEnd} />
              </Grid>
              <ColorWheel
                size={'size-2400'}
                value={color}
                onChange={onChange}
                onChangeEnd={props.onChangeEnd}
                isDisabled={isDisabled} />
            </View>
          </Flex>
        ) : (
          <Flex direction="column" gap={'size-50'} alignItems="center">
            <ColorArea
              {...props}
              value={color}
              onChange={onChange}
              onChangeEnd={props.onChangeEnd}
              isDisabled={isDisabled} />
            <ColorSlider
              value={color}
              onChange={onChange}
              onChangeEnd={props.onChangeEnd}
              channel={zChannel}
              isDisabled={isDisabled} />
          </Flex>
        )}
        <Flex direction="column" alignItems="center" gap="size-100" minWidth="size-1200">
          <div
            role="img"
            aria-label={`color swatch: ${color.toString('rgb')}`}
            title={`${color.toString('hex')}`}
            style={{width: '96px', height: '96px', background: color.toString('css')}} />
          <ColorField
            label="HEX Color"
            value={color}
            onChange={onChange}
            onKeyDown={event =>
              event.key === 'Enter' &&
              onChange((event.target as HTMLInputElement).value)
            }
            isDisabled={isDisabled}
            width="size-1200" />
        </Flex>
      </Flex>
    </div>
  );
}

export let XBlueYGreen = Template.bind({});
XBlueYGreen.storyName = 'RGB xChannel="blue", yChannel="green"';
XBlueYGreen.args = {defaultValue: '#0FF', xChannel: 'blue', yChannel: 'green', onChange: action('onChange'), onChangeEnd: action('onChangeEnd')};

export let XGreenYBlue = Template.bind({});
XGreenYBlue.storyName = 'RGB xChannel="green", yChannel="blue"';
XGreenYBlue.args = {...XBlueYGreen.args, xChannel: 'green', yChannel: 'blue'};

export let XBlueYRed = Template.bind({});
XBlueYRed.storyName = 'RGB xChannel="blue", yChannel="red"';
XBlueYRed.args = {...XBlueYGreen.args, defaultValue: '#F0F', xChannel: 'blue', yChannel: 'red'};

export let XRedYBlue = Template.bind({});
XRedYBlue.storyName = 'RGB xChannel="red", yChannel="blue"';
XRedYBlue.args = {...XBlueYGreen.args, defaultValue: '#F0F', xChannel: 'red', yChannel: 'blue'};

export let XRedYGreen = Template.bind({});
XRedYGreen.storyName = 'RGB xChannel="red", yChannel="green"';
XRedYGreen.args = {...XBlueYGreen.args, defaultValue: '#FF0', xChannel: 'red', yChannel: 'green'};

export let XGreenYRed = Template.bind({});
XGreenYRed.storyName = 'RGB xChannel="green", yChannel="red"';
XGreenYRed.args = {...XBlueYGreen.args, defaultValue: '#FF0', xChannel: 'green', yChannel: 'red'};

export let XBlueYGreenisDisabled = Template.bind({});
XBlueYGreenisDisabled.storyName = 'RGB xChannel="blue", yChannel="green", isDisabled';
XBlueYGreenisDisabled.args = {...XBlueYGreen.args, isDisabled: true};

/* TODO: how do we visually label and how to do we aria-label */
export let XBlueYGreenAriaLabelled = Template.bind({});
XBlueYGreenAriaLabelled.storyName = 'RGB xChannel="blue", yChannel="green", aria-label="foo"';
XBlueYGreenAriaLabelled.args = {...XBlueYGreen.args, label: undefined, 'aria-label': 'foo'};

export let XBlueYGreenSize3000 = Template.bind({});
XBlueYGreenSize3000.storyName = 'RGB xChannel="blue", yChannel="green", size="size-3000"';
XBlueYGreenSize3000.args = {...XBlueYGreen.args, size: 'size-3000'};

export let XBlueYGreenSize600 = Template.bind({});
XBlueYGreenSize600.storyName = 'RGB xChannel="blue", yChannel="green", size="size-600"';
XBlueYGreenSize600.args = {...XBlueYGreen.args, size: 'size-600'};


export let XSaturationYLightness = Template.bind({});
XSaturationYLightness.storyName = 'HSL xChannel="saturation", yChannel="lightness"';
XSaturationYLightness.args = {...XBlueYGreen.args, xChannel: 'saturation', yChannel: 'lightness', defaultValue: 'hsl(0, 100%, 50%)'};

export let XLightnessYSaturation = Template.bind({});
XLightnessYSaturation.storyName = 'HSL xChannel="lightness", yChannel="saturation"';
XLightnessYSaturation.args = {...XBlueYGreen.args, xChannel: 'lightness', yChannel: 'saturation', defaultValue: 'hsl(0, 100%, 50%)'};

export let XSaturationYLightnessisDisabled = Template.bind({});
XSaturationYLightnessisDisabled.storyName = 'HSL xChannel="saturation", yChannel="lightness", isDisabled';
XSaturationYLightnessisDisabled.args = {...XSaturationYLightness.args, isDisabled: true};

export let XHueYSaturationHSL = Template.bind({});
XHueYSaturationHSL.storyName = 'HSL xChannel="hue", yChannel="saturation"';
XHueYSaturationHSL.args = {...XSaturationYLightness.args, xChannel: 'hue', yChannel: 'saturation', defaultValue: 'hsl(0, 100%, 50%)'};

export let XSaturationYHueHSL = Template.bind({});
XSaturationYHueHSL.storyName = 'HSL xChannel="saturation", yChannel="hue"';
XSaturationYHueHSL.args = {...XSaturationYLightness.args, xChannel: 'saturation', yChannel: 'hue', defaultValue: 'hsl(0, 100%, 50%)'};

/* TODO: what does a disabled color area look like? */
export let XHueYSaturationHSLisDisabled = Template.bind({});
XHueYSaturationHSLisDisabled.storyName = 'HSL xChannel="hue", yChannel="saturation", isDisabled';
XHueYSaturationHSLisDisabled.args = {...XHueYSaturationHSL.args, isDisabled: true};

export let XHueYLightnessHSL = Template.bind({});
XHueYLightnessHSL.storyName = 'HSL xChannel="hue", yChannel="lightness"';
XHueYLightnessHSL.args = {...XHueYSaturationHSL.args, xChannel: 'hue', yChannel: 'lightness', defaultValue: 'hsl(0, 100%, 50%)'};

export let XLightnessYHueHSL = Template.bind({});
XLightnessYHueHSL.storyName = 'HSL xChannel="lightness", yChannel="hue"';
XLightnessYHueHSL.args = {...XHueYSaturationHSL.args, xChannel: 'lightness', yChannel: 'hue', defaultValue: 'hsl(0, 100%, 50%)'};

export let XHueYLightnessHSLisDisabled = Template.bind({});
XHueYLightnessHSLisDisabled.storyName = 'HSL xChannel="hue", yChannel="lightness", isDisabled';
XHueYLightnessHSLisDisabled.args = {...XHueYLightnessHSL.args, isDisabled: true};

export let XSaturationYBrightness = Template.bind({});
XSaturationYBrightness.storyName = 'HSB xChannel="saturation", yChannel="brightness"';
XSaturationYBrightness.args = {...XHueYSaturationHSL.args, xChannel: 'saturation', yChannel: 'brightness', defaultValue: 'hsb(0, 100%, 100%)'};

export let XBrightnessYSaturation = Template.bind({});
XBrightnessYSaturation.storyName = 'HSB xChannel="brightness", yChannel="saturation"';
XBrightnessYSaturation.args = {...XHueYSaturationHSL.args, xChannel: 'brightness', yChannel: 'saturation', defaultValue: 'hsb(0, 100%, 100%)'};

export let XSaturationYBrightnessisDisabled = Template.bind({});
XSaturationYBrightnessisDisabled.storyName = 'HSB xChannel="saturation", yChannel="brightness", isDisabled';
XSaturationYBrightnessisDisabled.args = {...XSaturationYBrightness.args, isDisabled: true};

export let XHueYSaturationHSB = Template.bind({});
XHueYSaturationHSB.storyName = 'HSB xChannel="hue", yChannel="saturation"';
XHueYSaturationHSB.args = {...XSaturationYBrightness.args, xChannel: 'hue', yChannel: 'saturation', defaultValue: 'hsb(0, 100%, 100%)'};

export let XSaturationYHueHSB = Template.bind({});
XSaturationYHueHSB.storyName = 'HSB xChannel="saturation", yChannel="hue"';
XSaturationYHueHSB.args = {...XSaturationYBrightness.args, xChannel: 'saturation', yChannel: 'hue', defaultValue: 'hsb(0, 100%, 100%)'};

export let XHueYSaturationHSBisDisabled = Template.bind({});
XHueYSaturationHSBisDisabled.storyName = 'HSB xChannel="hue", yChannel="saturation", isDisabled';
XHueYSaturationHSBisDisabled.args = {...XHueYSaturationHSB.args, isDisabled: true};

export let XHueYBrightnessHSB = Template.bind({});
XHueYBrightnessHSB.storyName = 'HSB xChannel="hue", yChannel="brightness"';
XHueYBrightnessHSB.args = {...XHueYSaturationHSB.args, xChannel: 'hue', yChannel: 'brightness', defaultValue: 'hsb(0, 100%, 100%)'};

export let XBrightnessYHueHSB = Template.bind({});
XBrightnessYHueHSB.storyName = 'HSB xChannel="brightness", yChannel="hue"';
XBrightnessYHueHSB.args = {...XHueYSaturationHSB.args, xChannel: 'brightness', yChannel: 'hue', defaultValue: 'hsb(0, 100%, 100%)'};

/* TODO: what does a disabled color area look like? */
export let XBrightnessYHueHSBisDisabled = Template.bind({});
XBrightnessYHueHSBisDisabled.storyName = 'HSB xChannel="brightness", yChannel="hue", isDisabled';
XBrightnessYHueHSBisDisabled.args = {...XBrightnessYHueHSB.args, isDisabled: true};
