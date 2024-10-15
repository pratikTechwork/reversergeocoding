const { Pool } = require('pg');
const pool = new Pool({
    user: "",
    host: '',
    database: "",
    password: '',
    port: ,
});
const key = ''
const getquery = 'select id , scan_1_location , state from scan_log where state is null'
const updatequery = `update scan_log set state = $1 , local_address = $2 where id=$3`
async function getscan_without_state(){
   try {
    const result = await pool.query(getquery)
    let scans = result.rows;
    for (let index = 0; index < scans.length; index++) {
        setTimeout(async() => {
        const {id ,scan_1_location:[latitude,longitude]} = scans[index]
        const link = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${key}`)
        const {display_name , address:{state}} = await link.json()
        const updatecolumns = await pool.query(updatequery,[state,display_name,id])
        console.log(updatecolumns.command);
            }, index * 1200);
    }
   } catch (error) {
    console.log(error);
   }
}
getscan_without_state()
