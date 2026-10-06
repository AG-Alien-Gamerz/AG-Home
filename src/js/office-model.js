export function parseOffices(csv) {
    const rows=[];let row=[],value='',quoted=false;
    for(let i=0;i<csv.length;i++) {
        const char=csv[i];
        if(char==='"'){if(quoted && csv[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
        else if(char===',' && !quoted){row.push(value);value='';}
        else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&csv[i+1]==='\n')i++;row.push(value);if(row.some(cell=>cell.trim()))rows.push(row);row=[];value='';}
        else value+=char;
    }
    if(quoted)throw new Error('Malformed CSV');
    row.push(value);if(row.some(cell=>cell.trim()))rows.push(row);
    const headers=(rows.shift()||[]).map(key=>key.trim().replace(/^\uFEFF/,''));
    if(!['id','type','name','latitude','longitude'].every(key=>headers.includes(key)))throw new Error('Missing CSV columns');
    const ids=new Set();
    return rows.map(cells=>{
        const record=Object.fromEntries(headers.map((key,index)=>[key,(cells[index]||'').trim()]));
        const latitude=Number(record.latitude),longitude=Number(record.longitude);
        if(!record.id || ids.has(record.id) || !record.latitude || !record.longitude || !Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)throw new Error('Invalid office record');
        ids.add(record.id);return {...record,latitude,longitude,demo:record.demo==='true'};
    });
}
export function matchesOffice(office,search,label='') {return [office.name,office.address,office.type,office.keywords,label].join(' ').normalize('NFKC').toLocaleLowerCase().includes(search.trim().normalize('NFKC').toLocaleLowerCase());}
