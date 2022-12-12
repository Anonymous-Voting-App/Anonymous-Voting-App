import React from 'react';
import './ResultOption.scss';
import { Rating, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const ResultOption = (props: any) => {
    const { optionData, highestCount, totalCount, type, voteStatus } = props;
    const showIcon = highestCount === optionData.count ? true : false;
    const showVote = voteStatus === 'showCount' ? true : false;
    let textData = '';
    if (type === 'free' && optionData === '') {
        textData = '';
    } else if (type === 'free' && optionData.title === 'No feedback') {
        textData = 'No feedback';
    } else {
        textData = optionData.title.value;
    }
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
                            {showVote ? (
                                <span className="option-count">
                                    ({optionData.count}/{totalCount})
                                </span>
                            ) : null}
                        </Typography>
                    </div>
                </div>
            ) : null}
            {type === 'star' ? (
                <div className="rating-type">
                    <Rating
                        name="rating-group"
                        value={optionData.title}
                        readOnly
                    />
                    <div className="value">
                        <Typography>
                            <span className="option-percent">
                                {optionData.percentage}%
                            </span>
                            {showVote ? (
                                <span className="option-count">
                                    ({optionData.count}/{totalCount})
                                </span>
                            ) : null}
                        </Typography>
                    </div>
                </div>
            ) : null}
            {type === 'upDown' ? (
                <div className="upDown-type">
                    <div className="upDown-icon">
                        {optionData.title === 'Yes' ? (
                            <ThumbUpIcon sx={{ fontSize: 100 }}></ThumbUpIcon>
                        ) : (
                            <ThumbDownIcon></ThumbDownIcon>
                        )}
                    </div>
                    <div className="value">
                        <Typography>
                            <span className="option-percent">
                                {optionData.percentage}%
                            </span>
                            {showVote ? (
                                <span className="option-count">
                                    ({optionData.count}/{totalCount})
                                </span>
                            ) : null}
                        </Typography>
                    </div>
                </div>
            ) : null}
            {type === 'free' ? (
                <div className="free-type">
                    <div>{textData}</div>
                </div>
            ) : null}
        </div>
    );
};

export default ResultOption;
