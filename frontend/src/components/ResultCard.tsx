import { Button, Paper, Typography } from '@mui/material';
import './ResultCard.scss';
import { ResultOptionObj } from '../utils/types';
import ResultOption from './ResultOption';
import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ResultCard = (props: any) => {
    const options: ResultOptionObj[] = props.ques.options;
    const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const handleExport = () => {
        const fileName = 'Data';
        const ws = XLSX.utils.json_to_sheet(options);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const setQuesType = (type: string) => {
        switch (type) {
            case 'checkBox':
                return 'Multi-choice';
            case 'radioBtn':
                return 'Pick one';
            case 'star':
                return 'Star rating';
            case 'free':
                return 'Free text';
            case 'yesNo':
                return 'Yes/No';
            case 'upDown':
                return 'Thumbs Up/Down';
            default:
                return 'Pick One';
        }
    };

    const quesType = setQuesType(props.ques.type);

    // for setting highest flag - tick icon for highest voted options
    const highestCount = options.reduce((prev, current) => {
        return prev.count > current.count ? prev : current;
    });

    return (
        <Paper className="question-wrapper" elevation={3}>
            <Typography className="question-type">{quesType}</Typography>
            <Typography className="question-title">
                {props.ques.title}
            </Typography>
            <div className="options-wrapper">
                {options.map((option, index) => (
                    <div key={index} className="option-row">
                        <ResultOption
                            totalCount={props.ques.totalCount}
                            highestCount={highestCount.count}
                            type={props.ques.type}
                            optionData={
                                quesType === 'Free text' && index > 1
                                    ? ''
                                    : option
                            }
                        ></ResultOption>
                    </div>
                ))}
            </div>
            {quesType === 'Free text' ? (
                <div className="free-text-export">
                    <div>
                        <MoreVertIcon></MoreVertIcon>
                    </div>
                    {/* <div className='separator'>.</div>
                <div className='separator'>.</div>
                <div >.</div> */}
                    <Button
                        className="searchButton"
                        variant="outlined"
                        onClick={handleExport}
                    >
                        Export Data
                    </Button>
                </div>
            ) : null}
        </Paper>
    );
};

export default ResultCard;
