import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as path from 'path';
import Excel from 'exceljs';
import { Movie, MovieStatusEnum } from '@prisma/client';
import { Workbook } from 'exceljs';
import { CreateMovieDto } from 'src/modules/movie/dto/create-movie.dto';
import { MovieEntity, MovieImportEntity } from 'src/modules/movie/entities/movie.entity';
// const filePath = path.resolve('.movie.xlsx');
// const filePath = path.resolve(__dirname, 'movie.xlsx');
// const filePath = path.resolve(__dirname, '../utils/movie.xlsx');
// const filePath = path.resolve(__dirname, 'movie.xlsx');
const filePath = path.resolve('D:/KIT/Semester5/Cloud Computing/Demo/src/movie.xlsx');



// type Movie = {
//   // id: number;
//   title: string;
//   image: string;
//   description: string;
//   duration_min: number;
//   rating: number;
//   price: number;
//   status: MovieStatusEnum;
// };
const getCellValue = (row: Excel.Row, cellIndex: number) => {
  const cell = row.getCell(cellIndex);

  return cell.value ? cell.value : '';
};


const main = async () => {
  const workbook = new Workbook();
  // const workbook = new Excel.Workbook();
  const content = await workbook.xlsx.readFile(filePath);

  const worksheet = content.worksheets[0];
  if (!worksheet || !worksheet.rowCount) {
    console.log('Worksheet is empty or does not exist.');
    return;
  }
  const rowStartIndex = 2;
  const numberOfRows = worksheet.rowCount - 1;

  const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];

  rows.filter(row => row.hasValues)
    .map((row): MovieImportEntity => {
      return {
        id: Number(getCellValue(row, 1)),

        title: getCellValue(row, 2).toString(),

        image: getCellValue(row, 3).toString(),
        description: getCellValue(row, 4).toString(),
        duration_min: +getCellValue(row, 5),

        rating: Number(getCellValue(row, 6)),
        price: Number(getCellValue(row, 7)),
        status: getCellValue(row, 8) as MovieStatusEnum // (YYY-MM-DD)
      } as MovieImportEntity
    });

};



@Injectable()
export class ExcelService {


  getCellValue = (row: Excel.Row, cellIndex: number) => {
    const cell = row.getCell(cellIndex);

    return cell.value ? cell.value : '';
  }

  async readDataFromExcel(file: Express.Multer.File) {
    const workbook = new Workbook();
    const content = await workbook.xlsx.readFile(file.path);
    const worksheet = content.worksheets[0];
    if (!worksheet || !worksheet.rowCount) {
      console.log('Worksheet is empty or does not exist.');
      return;
    }
    const rowStartIndex = 2;
    const numberOfRows = worksheet.rowCount - 1;

    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];

    const movies = rows.filter(row => row.hasValues)
      .map((row): MovieImportEntity => {
        return {
          // id: Number(getCellValue(row, 1)),
          title: getCellValue(row, 2).toString().toLocaleLowerCase(),

          image: getCellValue(row, 3).toString(),
          description: getCellValue(row, 4).toString(),
          duration_min: +getCellValue(row, 5),

          rating: Number(getCellValue(row, 6)),
          price: Number(getCellValue(row, 7)),
          status: getCellValue(row, 8) as MovieStatusEnum // (YYY-MM-DD)
        } as MovieImportEntity
      });
    return movies
  }
}