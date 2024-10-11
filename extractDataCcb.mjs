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

export async function extractDataCcb (filePath){
    try {
        const items = await readPdfFile(filePath);
        const organizedItems = items.sort((a, b) => a.y - b.y);
        
        // organizedItems.forEach(obj => console.log(obj.x, obj.y, obj.text));

        const firstField = organizedItems.find(obj => obj.x == 1.203 && obj.y == 27.387);
        const secondField = organizedItems.find(obj => obj.x == 1.203 && obj.y == 27.828);
        // console.log(organizedItems.find(obj => obj.x >= 9.109 && obj.y == 27.387 && obj.x <= 9.316).text);
        // console.log(organizedItems.find(obj => obj.x >= 9.109 && obj.y == 27.828 && obj.x <= 9.316).text);
        // console.log(organizedItems.find(obj => obj.x >= 8.92 && obj.y == 28.454 && obj.x <= 9.163).text)
        let despesaDeTarifaDeCadastro;
        let despesaFinancia;
        let seguro;
        let seguroFinancia;
        let total;
        if(firstField && secondField){
            
            despesaDeTarifaDeCadastro = organizedItems.find(obj => obj.x >= 9.0 && obj.y == 27.387 && obj.x <= 9.9).text;
            despesaFinancia = organizedItems.find(obj => obj.x == 10.504 && obj.y == 27.387).text;
            seguro = organizedItems.find(obj => obj.x >= 9.0 && obj.y == 27.828 && obj.x <= 9.9).text;
            seguroFinancia = organizedItems.find(obj => obj.x == 10.504 && obj.y == 27.828).text;
            total = organizedItems.find(obj => obj.x >= 8.0 && obj.y == 28.454 && obj.x <= 9.9).text;
        } else if (firstField && !secondField){
            
            if(firstField.text == '2 - Seguro'){
                seguro = organizedItems.find(obj => obj.x == 9.109 && obj.y == 27.387).text;
                seguroFinancia = organizedItems.find(obj => obj.x == 10.504 && obj.y == 27.387).text;
                despesaDeTarifaDeCadastro = '';
                despesaFinancia = '';
                total = organizedItems.find(obj => obj.x == 8.92 && obj.y == 28.013).text;
            } else if (firstField.text == '1 - Despesa de Tarifa de Cadastro'){
                despesaDeTarifaDeCadastro = organizedItems.find(obj => obj.x == 9.109 && obj.y == 27.387).text;
                despesaFinancia = organizedItems.find(obj => obj.x == 10.504 && obj.y == 27.387).text;
                seguro = '';
                seguroFinancia = '';
                total = organizedItems.find(obj => obj.x == 8.92 && obj.y == 28.013).text;
            }

        } else {
            despesaDeTarifaDeCadastro = '';
            despesaFinancia = '';
            seguro = '';
            seguroFinancia = '';
        }
        
        const mapCbb ={
            PLANILHA_DE_PROPOSTA_Nº: organizedItems.find(obj => obj.x == 8.731 && obj.y == 4.397).text,
            Situação: organizedItems.find(obj => obj.x == 27.78 && obj.y == 8.568).text,
            Cliente: organizedItems.find(obj => obj.x == 1.203 && obj.y == 9.527).text.replace('Cliente:', ''),
            Nº: organizedItems.find(obj => obj.x == 12.718 && obj.y == 9.527).text.replace('Nº.:', ''),
            Endereço: organizedItems.find(obj => obj.x == 1.203 && obj.y == 9.932).text.replace('Endereço:', ''),
            UF: organizedItems.find(obj => obj.x == 23.793 && obj.y == 9.932).text.replace('UF: ', ''),
            Compl: organizedItems.find(obj => obj.x == 12.718 && obj.y == 9.932).text.replace('Compl.:', ''),
            Bairro: organizedItems.find(obj => obj.x == 1.203 && obj.y == 10.341).text.replace('Bairro: ', ''),
            Cidade: organizedItems.find(obj => obj.x == 12.718 && obj.y == 10.341).text.replace('Cidade: ', ''),
            Cep: organizedItems.find(obj => obj.x == 23.793 && obj.y == 10.341).text.replace('Cep: ', ''),
            CPF: organizedItems.find(obj => obj.x == 1.203 && obj.y == 10.751).text.replace('CPF: ', ''),
            RG: organizedItems.find(obj => obj.x == 12.718 && obj.y == 10.751).text.replace('RG: ', ''),
            Matricula: organizedItems.find(obj => obj.x == 23.793 && obj.y == 10.751).text.replace('Matrícula: ', ''),
            Est_civil: organizedItems.find(obj => obj.x == 1.203 && obj.y == 11.156).text.replace('Est.Civil: ', ''),
            Fil_mãe: organizedItems.find(obj => obj.x == 12.718 && obj.y == 11.156).text.replace('Fil.Mãe: ', ''),
            Fone_Res: organizedItems.find(obj => obj.x == 23.793 && obj.y == 11.156).text.replace('Fone Res.: ', ''),
            Data_de_Nascimento: organizedItems.find(obj => obj.x == 1.203 && obj.y == 11.565).text.replace('Data de Nasc.: ', ''),
            Fil_Pai: organizedItems.find(obj => obj.x == 12.718 && obj.y == 11.565).text.replace('Fil. Pai: ', ''),
            Celular: organizedItems.find(obj => obj.x == 23.793 && obj.y == 11.565).text.replace('Celular: ', ''),
            Pessoa_Politicamente_Exposta: organizedItems.find(obj => obj.x == 1.203 && obj.y == 11.97).text.replace('Pessoa Politicamente Exposta:', ''),
            Data_Emissão_RG: organizedItems.find(obj => obj.x == 12.718 && obj.y == 11.97).text.replace('Dat. Emissão RG: ', ''),
            Telefone_Cônjugue: organizedItems.find(obj => obj.x == 23.793 && obj.y == 11.97).text.replace('Telefone do Cônjuge: ', ''),
            Benefício: organizedItems.find(obj => obj.x == 1.203 && obj.y == 12.38).text.replace('Benefício: ', ''),
            Idade: organizedItems.find(obj => obj.x == 12.718 && obj.y == 12.402).text.replace('Idade : ', ''),
            Suspeito_de_Fraude: organizedItems.find(obj => obj.x == 12.718 && obj.y == 12.812).text.replace('Suspeito de Fraude : ', ''),
            Data_Adm: organizedItems.find(obj => obj.x == 1.203 && obj.y == 15.386).text.replace('Data Adm.: ', ''),
            Salário: organizedItems.find(obj => obj.x == 23.793 && obj.y == 15.386).text.replace('Salário: ', ''),
            Produto: organizedItems.find(obj => obj.x == 1.203 && obj.y == 19.953).text.replace('Produto: ', ''),
            Convênio: organizedItems.find(obj => obj.x == 12.718 && obj.y == 19.953).text.replace('Convênio: ', ''),
            Canal: organizedItems.find(obj => obj.x == 26.007 && obj.y == 19.953).text.replace('Canal: ', ''),
            Matriz: organizedItems.find(obj => obj.x == 1.203 && obj.y == 20.394).text.replace('Matriz: ', ''),
            I_F: organizedItems.find(obj => obj.x == 12.718 && obj.y == 20.394).text.replace('I. F.: ', ''),
            Empresa: organizedItems.find(obj => obj.x == 1.203 && obj.y == 20.84).text.replace('Empresa: ', ''),
            Filial: organizedItems.find(obj => obj.x == 12.718 && obj.y == 20.84).text.replace('Filial: ', ''),
            Grupo: organizedItems.find(obj => obj.x == 1.203 && obj.y == 21.281).text.replace('Grupo: ', ''),
            Operador: organizedItems.find(obj => obj.x == 12.718 && obj.y == 21.281).text.replace('Operador: ', ''),
            Data_base: organizedItems.find(obj => obj.x == 1.203 && obj.y == 22.608).text.replace('Data Base: ', ''),
            Dt_1º_Venc: organizedItems.find(obj => obj.x == 10.248 && obj.y == 22.617).text.replace('Dt. 1º Venc.: ', ''),
            Dt_Ult_Venc: organizedItems.find(obj => obj.x == 18.919 && obj.y == 22.617).text.replace('Dt. Ult. Venc.: ', ''),
            Vl_Solicitado: organizedItems.find(obj => obj.x == 1.203 && obj.y == 23.018).text.replace('Vl.Solicitado:', ''),
            Vlr_Bruto: organizedItems.find(obj => obj.x == 10.248 && obj.y == 23.027).text.replace('Vlr. Bruto: ', ''),
            Forma_Pagto: organizedItems.find(obj => obj.x == 18.919 && obj.y == 23.027).text.replace('Forma Pagto: ', ''),
            Vlr_Liberado: organizedItems.find(obj => obj.x == 1.203 && obj.y == 23.423).text.replace('Vlr. Liberado: ', ''),
            Vlr_Parcela: organizedItems.find(obj => obj.x == 10.248 && obj.y == 23.432).text.replace('Vlr. Parcela: ', ''),
            Cod_Averb: organizedItems.find(obj => obj.x == 18.919 && obj.y == 23.432).text.replace('Cód. Averb:', ''),
            Vlr_IOF: organizedItems.find(obj => obj.x == 1.203 && obj.y == 23.832).text.replace('Vlr. IOF: ', ''),
            Qtd_Parcela: organizedItems.find(obj => obj.x == 10.248 && obj.y == 23.841).text.replace('Qtd Parcela: ', ''),
            Taxa_CET_a_m: organizedItems.find(obj => obj.x == 18.919 && obj.y == 23.877).text.replace('Taxa CET(a.m.).: ', ''),
            Principal: organizedItems.find(obj => obj.x == 1.203 && obj.y == 24.237).text.replace('Principal: ', ''),
            Taxa_CL_a_m: organizedItems.find(obj => obj.x == 10.248 && obj.y == 24.251).text.replace('Taxa CL a.m.: ', ''),
            Taxa_CET_a_a: organizedItems.find(obj => obj.x == 18.919 && obj.y == 24.282).text.replace('Taxa CET(a.a.).: ', ''),
            Taxa_Conferência_a_m: organizedItems.find(obj => obj.x == 1.203 && obj.y == 24.651).text.replace('Taxa Conferência(a.m).:', ''),
            Taxa_CL_a_a: organizedItems.find(obj => obj.x == 10.248 && obj.y == 24.656).text.replace('Taxa CL a.a.: ', ''),
            Taxa_Ap_a_m: organizedItems.find(obj => obj.x == 18.919 && obj.y == 24.692).text.replace('Taxa Ap.(a.m).: ', ''),
            Taxa_Conferência_a_a: organizedItems.find(obj => obj.x == 1.203 && obj.y == 25.061).text.replace('Taxa Conferência(a.a).:', ''),
            Taxa_Nominal_a_m: organizedItems.find(obj => obj.x == 10.248 && obj.y == 25.065).text.replace('Taxa Nominal(a.m): ', ''),
            Taxa_Ap_a_a: organizedItems.find(obj => obj.x == 18.919 && obj.y == 25.101).text.replace('Taxa Ap.(a.a).: ', ''),
            Taxa_Controle_a_m: organizedItems.find(obj => obj.x == 18.919 && obj.y == 25.506).text.replace('Taxa Controle(a.m).: ', ''),
            Taxa_Nominal_a_a: organizedItems.find(obj => obj.x == 10.248 && obj.y == 25.47).text.replace('Taxa Nominal(a.a): ', ''),
            Taxa_Controle_a_a: organizedItems.find(obj => obj.x == 18.919 && obj.y == 25.916).text.replace('Taxa Controle(a.a).: ', ''),
            Despesa_de_tarifa_de_cadastro: despesaDeTarifaDeCadastro,
            Despesa_de_tarifa_de_cadastro_Financia: despesaFinancia,
            Seguro: seguro,
            Seguro_Financia: seguroFinancia,
            Total: total,
        }
        // console.log(mapCbb)
        return mapCbb;
        
        
    } catch (error) {
        console.log(error)
    }
}

export async function convertCcbToExcel (allObjDatas){

    try {
        
        
        // Cria uma nova planilha
        const worksheet = XLSX.utils.json_to_sheet(allObjDatas);
            
        // Cria um novo workbook
        const workbook = XLSX.utils.book_new();
    
        // Adiciona a planilha ao workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    
        // Escreve o arquivo Excel
        XLSX.writeFile(workbook, `./excel_file/ccbDatas.xlsx`);
    } catch (error) {
        console.log(error)
    }
}

// const testFilePath = './ccbDocs/801084910.PDF';
// const testFilePath2 = './ccbDocs/801070803.PDF';
// const testFilePath3 = './ccbDocs/801085386.PDF';
// const testFilePath4 = './ccbDocs/801085593.PDF';
// const testFilePath5 = './ccbDocs/801086090.PDF';
// const testFilePath6 = './ccbDocs/801086133.PDF';
// const testFilePath7 = './ccbDocs/801088266.PDF';
// const testFilePath8 = './ccbDocs/801063721.PDF'
// const testFilePath9 = './ccbDocs/801064678.PDF'
// const testFilePath10 = './ccbDocs/801066570.PDF'
// const testFilePath11 = './ccbDocs/801067805.PDF'
// const testFilePath12 = './ccbDocs/801064678.PDF'
// const datas = await extractDataCcb(testFilePath11);

// await convertCcbToExcel(datas);

