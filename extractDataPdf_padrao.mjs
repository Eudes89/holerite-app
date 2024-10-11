import { PdfReader } from "pdfreader";
import fs from "fs/promises";
import * as XLSX from 'xlsx';

async function readPdfFile(filePath) {
    try {
        const pdfBuffer = await fs.readFile(filePath);
        let itemsFile = [];
        await new Promise((resolve, reject) => {
            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    console.error("error:", err);
                    reject(err);
                } else if (!item) {
                    resolve(itemsFile);
                } else if (item.text) {
                    itemsFile.push(item);
                }
            });
        });
        return itemsFile;
    } catch (err) {
        console.error("Failed to read file:", err);
    }
}

export async function extractDataPdf (filePath, id){
    const items = await readPdfFile(filePath);
    
    ////Este loop serve para ver todos os items no console
    //// do arquivo e suas posições
    // for( let i = 0; i < items.length; i++){
    //     console.log(items[i]);
    // }

    const dadosHolerite = {
        id: id,
        cnpj: '',
        referencia: '',
        registro: '',
        sessao: '',
        cliente: '',
        posto: '',
        data_adimissao: '',
        trabalhador: '',
        cargo: '',
        pis: '',
        salario_base: 0,
        sal_contr: 0,
        base_fgts: 0,
        fgts_mes: 0,
        base_irrf: 0,
        dep_ir: 0,
        total_proventos: 0,
        total_descontos: 0,
        total_liquido: 0,
        conta: '',
        banco: '',
        agencia: '',
        data_pagamento: '',

    }
    
    const dadosMutaveis = {};

    for (let i = 0; i < items.length; i++){
        if(items[i].x == 9.172){
            dadosHolerite.cnpj = items[i].text;
        } else if (items[i].x == 28.203){
            dadosHolerite.referencia = items[i].text;
        } else if (items[i].x == 0.547 && items[i].y == 6.712){
            dadosHolerite.registro = items[i].text;
        } else if (items[i].x == 12.219){
            dadosHolerite.sessao = items[i].text;
        } else if (items[i].x == 20.281){
            dadosHolerite.cliente = items[i].text;
        } else if (items[i].x == 23.563){
            dadosHolerite.posto = items[i].text;
        } else if (items[i].x == 26.938 && items[i].y == 6.712){
            dadosHolerite.data_adimissao = items[i].text;
        } else if (items[i].x == 30.174){
            dadosHolerite.trabalhador = items[i + 1].text;
        } else if (items[i].x == 15.641){
            dadosHolerite.cargo = items[i].text;
        } else if (items[i].x == 1.672){
            dadosHolerite.pis = items[i].text;
        } else if (items[i].y >= 10.415 && items[i].y < 41.193){
            if(!dadosMutaveis[items[i].y]){
                dadosMutaveis[items[i].y] = [{[items[i].x] : items[i].text}];
            }else {
                dadosMutaveis[items[i].y].push({[items[i].x] : items[i].text});
            }
        } else if (items[i].x == 2.234){
            dadosHolerite.salario_base = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 5.984){
            dadosHolerite.sal_contr = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 9.734){
            dadosHolerite.base_fgts = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 13.859){
            dadosHolerite.fgts_mes = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 17.188){
            dadosHolerite.base_irrf = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 20.188){
            dadosHolerite.dep_ir = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 24.031){
            dadosHolerite.total_proventos = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 28.719){
            dadosHolerite.total_descontos = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 28.438){
            dadosHolerite.total_liquido = parseFloat(items[i].text.replace(".", "").replace(",", "."));
        } else if (items[i].x == 15.359 && items[i].y == 42.946){
            dadosHolerite.conta = items[i].text;
        } else if (items[i].x == 3.641 && items[i].y == 43.602){
            dadosHolerite.banco = items[i].text;
        } else if (items[i].x == 3.641 && items[i].y == 44.259){
            dadosHolerite.agencia = items[i].text;
        } else if (items[i].x == 23.047 && items[i].y == 44.259){
            dadosHolerite.data_pagamento = items[i].text;
        }
    }

    
    // Organizar dadosMutaveis
    delete dadosMutaveis['36.953'];
    delete dadosMutaveis['36.719'];

    let entradaSaida = [];
    entradaSaida.push({id: id});
    for (let key in dadosMutaveis) {
        let item = {};
        dadosMutaveis[key].forEach(subItem => {
          for (let subKey in subItem) {
            let value = subItem[subKey];
            let numKey = parseFloat(subKey);
            if (numKey >= 1 && numKey < 2) {
              item.verba = parseInt(value);
            } else if (numKey >= 3 && numKey < 4) {
              item.descricao = value;
            } else if (numKey > 19 && numKey < 21) {
              item.refer = parseFloat(value.replace('.', '').replace(',', '.'));
            } else if (numKey > 22 && numKey < 25) {
              item.proventos = parseFloat(value.replace('.', '').replace(',', '.'));
            } else if (numKey > 28 && numKey < 30) {
              item.descontos = parseFloat(value.replace('.', '').replace(',', '.'));
            }
          }
        });
        entradaSaida.push(item);
    }
    
    // dadosHolerite.entradas_saidas = result;

    //Removendo caracteres que não sejam numeros do campo agencia
    dadosHolerite.agencia = dadosHolerite.agencia.replace(/\D/g, '');
    
    const allDatas = {
        dataHolerite: dadosHolerite,
        entradasSaidas: entradaSaida
    }
    
    return allDatas;
};

function sanitizeData(data) {
    return data.map(row => {
        const sanitizedRow = {};
        for (const key in row) {
            if (row[key] === undefined || row[key] === null) {
                sanitizedRow[key] = 0;
            } else {
                sanitizedRow[key] = row[key];
            }
        }
        return sanitizedRow;
    });
}

export async function convertToExcel(objData, fileName, type) {
    try {
        if(type === 'holerite'){

            // Sanitize os dados
            const sanitizedData = sanitizeData(objData);
    
            // Cria uma nova planilha
            const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
            
            // Cria um novo workbook
            const workbook = XLSX.utils.book_new();
        
            // Adiciona a planilha ao workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
        
            // Escreve o arquivo Excel
            XLSX.writeFile(workbook, `./excel_file/${fileName}.xlsx`);

        } else if (type === 'entradas'){
            function flattenArray(nestedArray) {
                return nestedArray.flat();
            }
            const flattenedData = flattenArray(objData);
            const sanitizedData = sanitizeData(flattenedData);
            // Cria uma nova planilha
            const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
            
            // Cria um novo workbook
            const workbook = XLSX.utils.book_new();
        
            // Adiciona a planilha ao workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
        
            // Escreve o arquivo Excel
            XLSX.writeFile(workbook, `./excel_file/${fileName}.xlsx`);
        }
        
    } catch (error) {
        console.log(error);
    }
}

