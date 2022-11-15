import React from 'react';
import './ResultOption.scss';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const ResultOption = (props: any) => {
    const { optionData, highestCount, totalCount, type } = props;
    const showIcon = highestCount === optionData.count ? true : false;
    return (
        <div className="option-wrapper">
            {type === 'radioBtn' || type === 'checkBox' || type === 'yesNo' ? (
                <div className="pickone-multi-type">
                    <div className="option">
                        <Typography>
                            <span className="icon-container">
                                {showIcon ? (
                                    <CheckIcon className="check-icon"></CheckIcon>
                                ) : null}
                            </span>
                            <span className="option-title">
                                {optionData.title}
                            </span>
                        </Typography>
                    </div>
                    <div className="value">
                        <Typography>
                            <span className="option-percent">
                                {optionData.percentage}%
                            </span>
                            <span className="option-count">
                                ({optionData.count}/{totalCount})
                            </span>
                        </Typography>
                    </div>
                </div>
            ) : null}
            {type === 'star' ? <div className="rating-type"></div> : null}
            {type === 'upDown' ? <div className="upDown-type"></div> : null}
            {type === 'free' ? <div className="free-type"></div> : null}
        </div>
    );
};

export default ResultOption;
