import visualization from "./visualization";
import liveanalyzer from "./liveanalyzer";

(function() {

  if ($("#visualization").length > 0) visualization();
  if ($("#liveanalyzer").length > 0) liveanalyzer();

})();
