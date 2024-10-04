import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { extractDataPdf, convertToExcel } from './extractDataPdf_padrao.mjs';

const readdir = promisify(fs.readdir);

// Caminho da pasta que contém os arquivos
const folderPath = './docs';

// Função para listar e ler arquivos PDF
async function readPDFFiles(folderPath) {
    try {
        // Listar todos os arquivos na pasta usando a versão promisificada
        const files = await readdir(folderPath);

        // Filtrar arquivos com extensão .pdf
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

        // Ler cada arquivo PDF
        let idFile = 1;
        let allDataHolerites = [];
        let allDataEntradas = [];
        for (const file of pdfFiles) {
            const filePath = path.join(folderPath, file);
            const extractData = await extractDataPdf(filePath, idFile);
            allDataHolerites.push(extractData.dataHolerite);
            allDataEntradas.push( extractData.entradasSaidas )
            idFile += 1
            
        }
          
        await convertToExcel(allDataEntradas, "entradas-saidas", 'entradas');
        await convertToExcel(allDataHolerites, "dados-holerites", 'holerite');
        console.log(`Todos os dados extraidos e salvados em arquivos excel na pasta ${folderPath}`)
    } catch (err) {
        console.error('Erro ao listar ou ler arquivos:', err);
    }
}

// Chamar a função para ler os arquivos PDF
readPDFFiles(folderPath);
