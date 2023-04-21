const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Inject the contents of multiple .yaml files onto a specific property of another .yaml file, outputing
 * the result to a new .yaml file
 * 
 * @param {object} args
 * @param {string} args.main       The path to main .yaml file into which injection should happen
 * @param {string} args.property   A dot-delimited property path on the main file where the partials should be injected
 * @param {string} args.partials   A glob string identifying the partial .yaml files
 * @param {string} args.output     The path where the combined contents should be output
 * 
 * @return void
 */
module.exports=function yamlInject(args){
  //Make sure we have all the args
  for(let [a,aa] of Object.entries( { m: 'main', p: 'partials', o: 'output', s: 'property' } )){
    args[aa] = args[aa] || args[a];
    delete args[a];
  }
  for(let aa of ['main','partials']){
    if ( ! args[aa] )
      throw new Error(`Missing required argument '${aa}'`);
  }
  // Read the contents of the main YAML file and parse it into an object
  const mainObj = yaml.load(fs.readFileSync(args.main, 'utf8'));

  // Find the property on the above object which we want to modify
  var propertyPointer = mainObj;
  for(let p of args.property.split('.')){
    if(p){ //ignore empty props
      if (!propertyPointer.hasOwnProperty(p)) {
        propertyPointer[p] = {};//If the path doesn't exist we create as we go
      }else if(typeof propertyPointer[p]!='object'||!propertyPointer[p]){
        exit(`The structure of ${args.main} doesn't allow for injecting at '${args.property}'. Failed while trying to access '${p}'`);
      }
      propertyPointer = propertyPointer[p];
    }
  };

  // Loop through all YAML files that match the glob pattern...
  for(let filepath of glob.sync(args.partials)){
    //...read and parse them into objects...
    const partialObj = yaml.load(fs.readFileSync(filepath, 'utf8'));
    
    //...then assign that object at the propertyPointer
    Object.assign(propertyPointer, partialObj);
  };

  // Convert the merged object to YAML and write it to the output file
  const outputYaml = yaml.dump(mainObj);
  fs.writeFileSync(args.output, outputYaml, 'utf8');
}
