"use client"
import { useState, ChangeEvent } from 'react';
import Papa from 'papaparse';

interface IParsedData {
  headers: string[];
  firstRow: string[];
}

export default function CSVTable() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [firstRow, setFirstRow] = useState<string[]>([]);

  function extractFirstTwoLines(file: File, callback: (lines: string) => void): void {
    const chunkSize = 10000; // Size in bytes
    let offset = 0;
    let resultText = '';
    const reader = new FileReader();
  
    const readChunk = (offset: number, chunkSize: number): void => {
      const blob: Blob = file.slice(offset, offset + chunkSize);
      reader.readAsText(blob);
    };
  
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (e.target?.result) {
        resultText += e.target.result as string;
        const lines = resultText;
        if (lines.length >= 2 || (e.target.result as string).length < chunkSize) {
          callback(lines);
        } else {
          offset += chunkSize;
          readChunk(offset, chunkSize);
        }
      }
    };
  
    readChunk(offset, chunkSize);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      extractFirstTwoLines(file, (lines: string) => {
        Papa.parse(lines, {
          preview: 2,
          complete: (result: Papa.ParseResult<string[]>) => {
            const parsedData = result.data;
            if (parsedData.length > 0) {
              setHeaders(parsedData[0]);
              setFirstRow(parsedData[1] || []);
            }
          },
          header: false
        });
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" className='fileUpload' onChange={handleFileChange} />
      <div className='flex flex-row items-center justify-center'>
        <table className='table'>
          <thead className='tableHead'>
            <tr className='tr'>
              <th className='th'>Headers</th>
              <th className='th'>First Row Values</th>
            </tr>
          </thead>
          {headers.length > 0 ? 
            <tbody className='tableBody'>
              {headers.map((header, index) => (
                <tr className='tr' key={index}>
                  <td className='td'>{header}</td>
                  <td className='td'>{firstRow[index]}</td>
                </tr>
              ))}
            </tbody> : 
            <tbody className='tableBody'>
              <tr className='tr'>
                <td className='td'></td>
                <td className='td'></td>
              </tr> 
            </tbody>
          }
        </table>
      </div>
    </div>
  );
}
