export default {
	methods: {
		montamenu() {
			if (this.$auth.check()) {

				$('.titleheadermenu').html(
					'<div class="row "><div class="col-4 col-sm-4 col-md-4 col-lg-4 "><img class="rounded-circle" style="margin-left: 15px;width: 40px" src="/images/face-3.jpg"></div><div class=" col-8 col-sm-8 col-md-8 col-lg-8" style="color:#fff" align="left"><i style="margin-left: 0px!important">Bem vindo(a) <br> '+this.$store.getters.nomeusuario.split(" ")[0]+'</i></div></div><hr>'

					);
			}else{
				$('.titleheadermenu').html('<div class="row "><div class=" col-12 col-sm-12 col-md-12 col-lg-12" style="color:#fff; font-size: 1.5em" align="center"><i style="margin-left: 0px!important">ShoGestão</i></div></div><hr>'
					)
			}
		}
	}
}