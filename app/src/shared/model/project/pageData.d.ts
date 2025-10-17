
import {SvgIcon} from '@/shared/model/icon'

type FirstScreenBackgroundImage = () => JSX.Element

export type PageData = {
        home: {
            title: string;
            subtitle: string;
            descriptionList: {
                icon: ({ className, color, }: SvgIcon) => JSX.Element;
                text: string;
            }[];
            firstScreenBackgroundImage: undefined | FirstScreenBackgroundImage;
            policyUrl: string;
            termsUrl: string;
        };
        result: {
            video: {
                src: string;
                active: boolean;
            };
        };
    }