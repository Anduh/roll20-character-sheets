
// update sheets created with old tab setup to new default tab
on('sheet:opened', function() {
  getAttrs(['sheetTab'], function(v) {
      let tab = parseInt(v.sheetTab) || 0;
      if(tab) {
          setAttrs({
              sheetTab: 'character'
          });
      }
  });
});
// sheet tab action buttons
const buttonlist = ["character","social","skill","equipment","combat","spells","psionics","healer","wards","circles","structures","journal","configuration","release"];
buttonlist.forEach(button => {
  on(`clicked:${button}`, function() {
      setAttrs({
          sheetTab: button
      });
  });
});
on("change:iq sheet:opened", function () {
      getAttrs(['iq'], function (values) {
          const iq = parseInt(values['iq'])||0;
          let iq_bonus = 0;
          if(iq > 15) iq_bonus = Math.round(iq -14);
          setAttrs({
              iq_bonus: iq_bonus
          });
      });
});
on("change:me sheet:opened", function () {
  getAttrs(['me'], function (values) {
      const mep = parseInt(values['me'])||0;
      const mei = parseInt(values['me'])||0;
      let me_psionic = 0;
      if (mep > 15) me_psionic = Math.round((mep -15)*.5);
      let me_insanity = 0;
      if (mei > 20) me_insanity = Math.round(mei -17);
      else if (mei > 15) me_insanity = Math.round((mei-15)*.5);
      setAttrs({
          me_psionic: me_psionic,
          me_insanity: me_insanity
      });
  });
});
function maMod(score) {
  let bonus = 0;
  if (score >= 30) bonus = 97;
  else if (score >= 29) bonus = 96;
  else if (score >= 28) bonus = 94;
  else if (score >= 27) bonus = 92;
  else if (score >= 26) bonus = 88;
  else if (score >= 25) bonus = 84;
  else if (score >= 16) bonus = Math.floor(score-8)*5;
  return bonus;
}; 
on("change:ma sheet:opened", function () {
  getAttrs(['ma'], function (values) {
      let ma = parseInt(values['ma'])||0;
      let invoke_trust = maMod(ma);
      setAttrs({                            
          invoke_trust: invoke_trust
      });
  });
});
on("change:ps sheet:opened", function () {
      getAttrs(['ps'], function (values) {
          const ps = parseInt(values['ps'])||0;
          const psx20 = ps*20;
          const psx10 = ps*10;
          let ps_bonus = 0;
          if(ps > 15) ps_bonus = Math.round(ps -15);
          setAttrs({
              lift: psx20,
              carry: psx10,
              ps_bonus: ps_bonus
          });
      });
});
function ppMod(score) {
  let bonus = 0;
  if (score >= 16) bonus = Math.round((score-15)*.5);
  return bonus;
}; 
on("change:pp sheet:opened", function () {
  getAttrs(['pp'], function (values) {
      let pp = parseInt(values['pp'])||0;
      let pp_bonus = ppMod(pp);
      setAttrs({                            
          pp_bonus: pp_bonus
      });
  });
});    
on("change:pe sheet:opened", function () {
  getAttrs(['pe'], function (values) {
      const pe = parseInt(values['pe'])||0;
      const pec = pe;
      const per = pe;
      let pe_magpois = 0;
      if (pe > 15) pe_magpois = Math.round((pe -15)*.5);
      let pe_coma = 0;
      if (pe > 15) pe_coma = Math.round(pe -12);
      else if (pe > 17) pe_coma = Math.round((pe -15)*2);
      setAttrs({
          carry_max: pec,
          run_max: per,
          pe_magpois: pe_magpois,
          pe_coma: pe_coma
      });
  });
}); 
function pbMod(score) {
  let bonus = 0;
  if (score >= 30) bonus = 92;
  else if (score >= 27) bonus = (score *3) +3;
  else if (score >= 16) bonus = Math.floor(score-10)*5;
  return bonus;
}; 
on("change:pb sheet:opened", function () {
  getAttrs(['pb'], function (values) {
      let pb = parseInt(values['pb'])||0;
      let charm_impress = pbMod(pb);
      setAttrs({                            
          charm_impress: charm_impress
      });
  });
}); 
on("change:spd sheet:opened", function () {
  getAttrs(['spd'], function (values) {
      const spd = parseInt(values['spd'])||0;
      const runmel = spd*15;
      const runmil = Math.round(spd*.68);
      setAttrs({
          run_melee: runmel,
          run_mph: runmil
      });
  });
}); 
on("change:spd change:hth_numberattacks sheet:opened", function () {
  getAttrs(['spd','hth_numberattacks'], function (values) {
      const spd = parseInt(values['spd'])||0;
      const hth_numberattacks = parseInt(values['hth_numberattacks'])||0;
      const modifier = Math.round((spd/hth_numberattacks)*15); 
      setAttrs({
          run_attack: modifier
      });
  });
});
const repeatingSum = (destination, section, fields, multiplier = 1) => {
  if (!Array.isArray(fields)) fields = [fields];
  getSectionIDs(`repeating_${section}`, idArray => {
      const attrArray = idArray.reduce( (m,id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${field}`))],[]);
      getAttrs(attrArray, v => {
          console.log("===== values of v: "+ JSON.stringify(v) +" =====");
           // getValue: if not a number, returns 1 if it is 'on' (checkbox), otherwise returns 0..
          const getValue = (section, id,field) => parseFloat(v[`repeating_${section}_${id}_${field}`], 10) || (v[`repeating_${section}_${id}_${field}`] === 'on' ? 1 : 0); 
          const sumTotal = idArray.reduce((total, id) => total + fields.reduce((subtotal,field) => subtotal * getValue(section, id,field),1),0);
          setAttrs({[destination]: sumTotal * multiplier});    
      });
  });
};
on('change:repeating_weapon remove:repeating_weapon', function() {
  repeatingSum("total_weapon","weapon",["weapon_weight","weapon_count"]);
});
on('change:repeating_armor remove:repeating_armor', function() {
  repeatingSum("total_armor","armor",["armor_weight","armor_count"]);
});
on('change:repeating_gear remove:repeating_gear', function() {
  repeatingSum("total_gear","gear",["gear_weight","gear_count"]);
});
on('change:repeating_consumables remove:repeating_consumables', function() {
  repeatingSum("total_consumables","consumables",["consumables_weight","consumables_count"]);
});
on('change:repeating_wealth remove:repeating_wealth', function() {
  repeatingSum("total_wealth","wealth",["wealth_weight","wealth_count"]);
});
on("change:total_weapon change:total_armor change:total_gear change:total_consumables change:total_wealth", function () {
  getAttrs(['total_weapon','total_armor','total_gear','total_consumables','total_wealth'], function (values) {
      const total_weapon = parseInt(values['total_weapon'])||0;
      const total_armor = parseInt(values['total_armor'])||0;
      const total_gear = parseInt(values['total_gear'])||0;
      const total_consumables = parseInt(values['total_consumables'])||0;
      const total_wealth = parseInt(values['total_wealth'])||0;
      const total_weight = Math.round(total_weapon+total_armor+total_gear+total_consumables+total_wealth);
      setAttrs({
          total_weight: total_weight
      });
  });
}); 

// Skill success rating calculators    
on("change:repeating_skillocc:skill_rating change:repeating_skillocc:skill_bonus change:iq_bonus change:temp_skill", function () {
  getSectionIDs(`repeating_skillocc`, idArray => {
      const fieldnames = [];
      idArray.forEach(id => fieldnames.push(
          `repeating_skillocc_${id}_skill_rating`,
          `repeating_skillocc_${id}_skill_bonus`
      ));
      getAttrs([...fieldnames, 'iq_bonus','temp_skill'], function (values) {
          const output = {};
          const iq_bonus = parseInt(values['iq_bonus']) || 0;
          const temp_skill = parseInt(values['temp_skill']) || 0;
          idArray.forEach(id => {
              const rating = parseInt(values[`repeating_skillocc_${id}_skill_rating`]) || 0;
              const bonus = parseInt(values[`repeating_skillocc_${id}_skill_bonus`]) || 0;
              
              const total = Math.round(rating + iq_bonus + temp_skill + bonus);
              output[`repeating_skillocc_${id}_skill_total`] = total;
          });
          setAttrs(output);
      });
  });
});
on("change:repeating_skillelective:skill_rating change:repeating_skillelective:skill_bonus change:iq_bonus change:temp_skill", function () {
  getSectionIDs(`repeating_skillelective`, idArray => {
      const fieldnames = [];
      idArray.forEach(id => fieldnames.push(
          `repeating_skillelective_${id}_skill_rating`,
          `repeating_skillelective_${id}_skill_bonus`
      ));
      getAttrs([...fieldnames, 'iq_bonus','temp_skill'], function (values) {
          const output = {};
          const iq_bonus = parseInt(values['iq_bonus']) || 0;
          const temp_skill = parseInt(values['temp_skill']) || 0;
          idArray.forEach(id => {
              const rating = parseInt(values[`repeating_skillelective_${id}_skill_rating`]) || 0;
              const bonus = parseInt(values[`repeating_skillelective_${id}_skill_bonus`]) || 0;
              
              const total = Math.round(rating + iq_bonus + temp_skill + bonus);
              output[`repeating_skillelective_${id}_skill_total`] = total;
          });
          setAttrs(output);
      });
  });
});
on("change:repeating_skillsecondary:skill_rating change:repeating_skillsecondary:skill_bonus change:iq_bonus change:temp_skill", function () {
  getSectionIDs(`repeating_skillsecondary`, idArray => {
      const fieldnames = [];
      idArray.forEach(id => fieldnames.push(
          `repeating_skillsecondary_${id}_skill_rating`,
          `repeating_skillsecondary_${id}_skill_bonus`
      ));
      getAttrs([...fieldnames, 'iq_bonus','temp_skill'], function (values) {
          const output = {};
          const iq_bonus = parseInt(values['iq_bonus']) || 0;
          const temp_skill = parseInt(values['temp_skill']) || 0;
          idArray.forEach(id => {
              const rating = parseInt(values[`repeating_skillsecondary_${id}_skill_rating`]) || 0;
              const bonus = parseInt(values[`repeating_skillsecondary_${id}_skill_bonus`]) || 0;
              
              const total = Math.round(rating + iq_bonus + temp_skill + bonus);
              output[`repeating_skillsecondary_${id}_skill_total`] = total;
          });
          setAttrs(output);
      });
  });
});
on("change:repeating_skillmystic:skill_rating change:repeating_skillmystic:skill_bonus change:iq_bonus change:temp_skill", function () {
  getSectionIDs(`repeating_skillmystic`, idArray => {
      const fieldnames = [];
      idArray.forEach(id => fieldnames.push(
          `repeating_skillmystic_${id}_skill_rating`,
          `repeating_skillmystic_${id}_skill_bonus`
      ));
      getAttrs([...fieldnames, 'iq_bonus','temp_skill'], function (values) {
          const output = {};
          idArray.forEach(id => {
              const rating = parseInt(values[`repeating_skillmystic_${id}_skill_rating`]) || 0;
              const bonus = parseInt(values[`repeating_skillmystic_${id}_skill_bonus`]) || 0;
              
              const total = Math.round(rating + bonus);
              output[`repeating_skillmystic_${id}_skill_total`] = total;
          });
          setAttrs(output);
      });
  });
});