import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const EyeOnSvg: React.FC = () => {
    return (
        <Svg width={16} height={16} fill='none'>
            <G
                stroke='#748BA0'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.2}
                clipPath='url(#a)'
            >
                <Path d='M8 10.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334z' />
                <Path d='M8 13.333C3.333 13.333.667 8 .667 8S3.333 2.667 8 2.667 15.333 8 15.333 8 12.667 13.333 8 13.333z' />
            </G>
            <Defs>
                <ClipPath id='a'>
                    <Path fill='#fff' d='M0 0h16v16H0z' />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default EyeOnSvg;

